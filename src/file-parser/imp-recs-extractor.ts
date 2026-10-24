import { type ImportExpression, type Program, type Span, Visitor } from "oxc-parser";

import type { Nullable } from "~/lib/ts.ts";
import { isString } from "~/lib/vtype.ts";
import type { ImpRec } from "~/values.ts";

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

export function extractImpRecs({ program }: { program: Program }) {
	const recs: ImpRec[] = [];

	function createImpRec(
		{ node, locator, isDynamic = false }: { node: Span; locator: Nullable<string>; isDynamic?: boolean },
	) {
		const { start, end } = node;

		return {
			isDynamic,
			locator,
			posSpan: { start, end },
		};
	}

	const visitor = new Visitor({
		// Dynamic import
		ImportExpression(node) {
			recs.push(createImpRec({ node, isDynamic: true, locator: extractLocatorFromDynamicImport(node) }));
		},
		// Static import
		ImportDeclaration(node) {
			recs.push(createImpRec({ node, locator: node.source.value }));
		},
		// Named re-export if source exists
		ExportNamedDeclaration(node) {
			if (!node.source) {
				return;
			}

			recs.push(createImpRec({ node, locator: node.source.value }));
		},
		// Full re-export via *
		ExportAllDeclaration(node) {
			recs.push(createImpRec({ node, locator: node.source.value }));
		},
	});

	visitor.visit(program);

	return recs;
}
