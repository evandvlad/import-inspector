import { type ImportExpression, type Program, type Span, Visitor } from "oxc-parser";

import type { ImportRec } from "../values.ts";

function extractLocatorFromDynamicImport({ source }: ImportExpression) {
	/*
	 * import("source")
	 */
	if (source.type === "Literal" && typeof source.value === "string") {
		return source.value;
	}

	/*
	 * import(`source`) - without variables in the template literal
	 */
	if (
		source.type === "TemplateLiteral" && source.quasis.length === 1 &&
		source.expressions.length === 0
	) {
		return source.quasis[0].value.cooked;
	}

	return null;
}

export function extractImportRecs({ program }: { program: Program }) {
	const recs: ImportRec[] = [];

	function createImportRec(
		{ node, locator, isDynamic = false }: { node: Span; locator: string | null; isDynamic?: boolean },
	) {
		const { start, end } = node;

		return {
			isDynamic,
			locator,
			posSpan: { start, end },
		};
	}

	const visitor = new Visitor({
		// dynamic import
		ImportExpression(node) {
			recs.push(createImportRec({ node, isDynamic: true, locator: extractLocatorFromDynamicImport(node) }));
		},
		// static import
		ImportDeclaration(node) {
			recs.push(createImportRec({ node, locator: node.source.value }));
		},
		// named re-export if the source exists
		ExportNamedDeclaration(node) {
			if (!node.source) {
				return;
			}

			recs.push(createImportRec({ node, locator: node.source.value }));
		},
		// full re-export via *
		ExportAllDeclaration(node) {
			recs.push(createImportRec({ node, locator: node.source.value }));
		},
	});

	visitor.visit(program);

	return recs;
}
