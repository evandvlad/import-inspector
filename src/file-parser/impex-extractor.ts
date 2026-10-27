import {
	type ArrayPattern,
	type BindingIdentifier,
	type BindingRestElement,
	type Declaration,
	type IdentifierName,
	type IdentifierReference,
	type ImportExpression,
	type ObjectPattern,
	type Program,
	type PropertyKey,
	type Span,
	type StringLiteral,
	type TSQualifiedName,
	type VariableDeclarator,
	Visitor,
} from "oxc-parser";

import { assertNever, type Nullable } from "~/lib/ts.ts";
import { isString } from "~/lib/vtype.ts";
import type { ExpRec, Impex, ImpRec, ReExpRec } from "~/values.ts";

const defaultValue = "default";
const allValues = "*";

function uniqValues(values: string[]) {
	return Array.from(new Set(values));
}

function extractValueFromIdentifier(
	node: IdentifierName | IdentifierReference | StringLiteral | TSQualifiedName | BindingIdentifier,
) {
	if (node.type === "Literal") {
		return node.value;
	}

	if (node.type === "TSQualifiedName") {
		return node.right.name;
	}

	return node.name;
}

function extractLocatorFromDynamicImport({ source }: ImportExpression) {
	/*
	 * import("source")
	 */
	if (source.type === "Literal" && isString(source.value)) {
		return source.value;
	}

	/*
	 * import(`source`) - without variables in template literal
	 */
	if (
		source.type === "TemplateLiteral" && source.quasis.length === 1 &&
		source.expressions.length === 0
	) {
		return source.quasis[0].value.cooked;
	}

	return null;
}

function extractValueFromObjectPropertyKey({ propKey }: { propKey: PropertyKey }) {
	if ("name" in propKey) {
		return isString(propKey.name) ? propKey.name : extractValueFromIdentifier(propKey.name);
	}

	if ("value" in propKey && isString(propKey.value)) {
		return propKey.value;
	}

	return null;
}

function extractValueFromResetElement({ restElement }: { restElement: BindingRestElement }) {
	const { type } = restElement.argument;

	switch (type) {
		case "Identifier":
			return extractValueFromIdentifier(restElement.argument);

		// Don't process them now
		case "ArrayPattern":
		case "ObjectPattern":
		case "AssignmentPattern":
			return null;

		default:
			assertNever(type);
	}
}

// Process only 1 depth level without complications
function extractExportValuesFromArrayPatter({ arrayPattern }: { arrayPattern: ArrayPattern }) {
	const values = arrayPattern.elements.reduce<string[]>((acc, prop) => {
		if (!prop) {
			return acc;
		}

		const { type } = prop;

		switch (type) {
			case "Identifier": {
				acc.push(extractValueFromIdentifier(prop));
				break;
			}

			case "AssignmentPattern": {
				if (prop.left.type === "Identifier") {
					acc.push(extractValueFromIdentifier(prop.left));
				}

				break;
			}

			case "RestElement": {
				const value = extractValueFromResetElement({ restElement: prop });

				if (value) {
					acc.push(value);
				}

				break;
			}

			// Process only simple cases, ignore them
			case "ObjectPattern":
			case "ArrayPattern":
				break;

			default:
				assertNever(type);
		}

		return acc;
	}, []);

	if (values.length === 0) {
		return null;
	}

	const vals = uniqValues(values);

	return { lhValues: vals, rhValues: vals };
}

// Process only 1 depth level without complications
function extractExportValuesFromObjectPattern({ objPattern }: { objPattern: ObjectPattern }) {
	const values = objPattern.properties.reduce<string[]>((acc, prop) => {
		const { type } = prop;

		switch (type) {
			case "Property": {
				const value = extractValueFromObjectPropertyKey({ propKey: prop.key });

				if (value) {
					acc.push(value);
				}

				break;
			}

			case "RestElement": {
				const value = extractValueFromResetElement({ restElement: prop });

				if (value) {
					acc.push(value);
				}

				break;
			}

			default:
				assertNever(type);
		}

		return acc;
	}, []);

	if (values.length === 0) {
		return null;
	}

	const vals = uniqValues(values);

	return { lhValues: vals, rhValues: vals };
}

function extractExportValuesFromVariableDeclarator({ declarator }: { declarator: VariableDeclarator }) {
	const { id } = declarator;
	const { type } = id;

	switch (type) {
		case "Identifier": {
			const value = extractValueFromIdentifier(id);
			return { lhValues: [value], rhValues: [value] };
		}

		case "ArrayPattern": {
			return extractExportValuesFromArrayPatter({ arrayPattern: id });
		}

		case "ObjectPattern": {
			return extractExportValuesFromObjectPattern({ objPattern: id });
		}

		// It's not for simple shallow cases
		case "AssignmentPattern": {
			return null;
		}

		default:
			assertNever(type);
	}
}

function extractExportValuesFromDeclaration({ declaration }: { declaration: Declaration }) {
	const { type } = declaration;

	switch (type) {
		case "VariableDeclaration": {
			return declaration.declarations.reduce<{ lhValues: string[]; rhValues: string[] }>((acc, declarator) => {
				const result = extractExportValuesFromVariableDeclarator({ declarator });

				if (result) {
					acc.lhValues.push(...result.lhValues);
					acc.rhValues.push(...result.rhValues);
				}

				return acc;
			}, { lhValues: [], rhValues: [] });
		}

		case "ClassDeclaration":
		case "FunctionDeclaration":
		case "TSModuleDeclaration":
		case "TSImportEqualsDeclaration":
		case "TSDeclareFunction":
		case "TSTypeAliasDeclaration":
		case "TSInterfaceDeclaration":
		case "TSEnumDeclaration": {
			const value = declaration.id ? extractValueFromIdentifier(declaration.id) : null;
			return value ? { lhValues: [value], rhValues: [value] } : null;
		}

		// They can't appear in the current context
		case "FunctionExpression":
		case "TSEmptyBodyFunctionExpression":
		case "ClassExpression":
			return null;

		default:
			assertNever(type);
	}
}

function createImpRec(
	{ node, locator, values, isDynamic = false }: {
		node: Span;
		locator: Nullable<string>;
		values: string[];
		isDynamic?: boolean;
	},
): ImpRec {
	const { start, end } = node;

	return {
		kind: "imp",
		values,
		locator,
		isDynamic,
		posSpan: { start, end },
	};
}

function createReExpRec(
	{ node, locator, lhValues, rhValues }: { node: Span; locator: string; lhValues: string[]; rhValues: string[] },
): ReExpRec {
	const { start, end } = node;

	return {
		kind: "re-exp",
		lhValues,
		rhValues,
		locator,
		posSpan: { start, end },
	};
}

function createExpRec({ node, lhValues, rhValues }: { node: Span; lhValues: string[]; rhValues: string[] }): ExpRec {
	const { start, end } = node;

	return {
		kind: "exp",
		lhValues,
		rhValues,
		posSpan: { start, end },
	};
}

export function extractImpex({ program }: { program: Program }) {
	const impex: Impex = {
		imps: [],
		reExps: [],
		exps: [],
	};

	const visitor = new Visitor({
		/*
		 * Dynamic import
		 *
		 * import("foo")
		 */
		ImportExpression(node) {
			impex.imps.push(
				createImpRec({
					node,
					isDynamic: true,
					locator: extractLocatorFromDynamicImport(node),
					values: [allValues],
				}),
			);
		},

		/*
		 * Static import
		 *
		 * import foo from "bar"
		 * import * as foo from "bar"
		 * import { foo } from "bar"
		 * import "foo"
		 */
		ImportDeclaration(node) {
			const { specifiers } = node;

			// Specifiers are empty for the `import "foo"` case.
			const values = specifiers.length === 0 ? [allValues] : uniqValues(specifiers.map((specifier) => {
				const { type } = specifier;

				switch (type) {
					case "ImportDefaultSpecifier":
						return defaultValue;

					case "ImportNamespaceSpecifier":
						return allValues;

					case "ImportSpecifier":
						return extractValueFromIdentifier(specifier.imported);

					default:
						assertNever(type);
				}
			}));

			impex.imps.push(createImpRec({
				node,
				locator: node.source.value,
				values: values.includes(allValues) && values.length > 1 ? [allValues] : values,
			}));
		},

		/*
		 * Named export/re-export
		 *
		 * export { default, foo } from "bar"
		 * export { default as foo } from "bar"
		 * export {}
		 * export { default }
		 * export { foo, bar as baz }
		 * export const foo = bar, ...
		 * export function foo() {}
		 * export class Foo {}
		 * export const { bar, baz: qux } = foo;
		 * export const [ bar, baz ] = foo;
		 */
		ExportNamedDeclaration(node) {
			const { source, specifiers, declaration } = node;

			// re-exports
			if (source) {
				const lhValues = uniqValues(specifiers.map(({ local }) => extractValueFromIdentifier(local)));
				const rhValues = uniqValues(specifiers.map(({ exported }) => extractValueFromIdentifier(exported)));

				impex.reExps.push(createReExpRec({ node, lhValues, rhValues, locator: source.value }));
				return;
			}

			// export {};
			if (specifiers.length === 0 && !declaration) {
				impex.exps.push(createExpRec({ node, lhValues: [], rhValues: [] }));
				return;
			}

			// export { foo, bar as baz, ... }
			if (specifiers.length > 0) {
				const lhValues = uniqValues(specifiers.map(({ local }) => extractValueFromIdentifier(local)));
				const rhValues = uniqValues(specifiers.map(({ exported }) => extractValueFromIdentifier(exported)));

				impex.exps.push(createExpRec({ node, lhValues, rhValues }));
				return;
			}

			if (!declaration) {
				return;
			}

			// export var/let/const/function/class ...
			const result = extractExportValuesFromDeclaration({ declaration });

			if (!result) {
				return;
			}

			impex.exps.push(createExpRec({ node, lhValues: result.lhValues, rhValues: result.rhValues }));
		},

		/*
		 * Default export
		 *
		 * export default Foo;
		 * export default expression/function/class/...
		 */
		ExportDefaultDeclaration(node) {
			impex.exps.push(createExpRec({ node, lhValues: ["default"], rhValues: ["default"] }));
		},

		/*
		 * Full re-export via *
		 *
		 * export * from "foo"
		 * export * as foo from "bar"
		 */
		ExportAllDeclaration(node) {
			const { source, exported } = node;

			impex.reExps.push(createReExpRec({
				node,
				locator: source.value,
				lhValues: [allValues],
				rhValues: [exported ? extractValueFromIdentifier(exported) : allValues],
			}));
		},
	});

	visitor.visit(program);

	return impex;
}
