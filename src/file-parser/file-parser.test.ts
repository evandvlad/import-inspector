import { describe, it } from "node:test";
import { expect } from "@std/expect";

import { parseFile } from "./file-parser.ts";

function createParams({ content, path = "C:/foo/bar.ts" }: { content: string; path?: string }) {
	return {
		path,
		content,
	};
}

describe("file-parser", () => {
	it("empty file", async () => {
		const params = createParams({ content: "" });
		const impex = await parseFile(params);

		expect(impex).toEqual({
			imps: [],
			reExps: [],
			exps: [],
		});
	});

	it("throws error on file parsing", async () => {
		const params = createParams({ content: "parse error" });

		await expect(parseFile(params)).rejects.toThrow(
			"Failed to parse file 'C:/foo/bar.ts'. Expected a semicolon or an implicit semicolon after a statement, but found none\n  x Expected a semicolon or an implicit semicolon after a statement, but found\n  | none\n   ,-[C:/foo/bar.ts:1:6]\n 1 | parse error\n   :      ^\n   `----\n  help: Try inserting a semicolon here\n",
		);
	});

	it("no error for React syntax in a JS file", async () => {
		const params = createParams({
			path: "C:/foo/bar.js",
			content: `
				export default function F() {
					return <div>Hello</div>;
				}
			`,
		});

		const impex = await parseFile(params);

		expect(impex).toBeDefined();
	});

	it("single line comment", async () => {
		const params = createParams({ content: `// import foo from "foo";` });
		const impex = await parseFile(params);

		expect(impex).toEqual({
			imps: [],
			reExps: [],
			exps: [],
		});
	});

	it("multi-line comment", async () => {
		const params = createParams({
			content: `
			/** 
			 * import foo from "foo";
			 */
		`,
		});
		const impex = await parseFile(params);

		expect(impex).toEqual({
			imps: [],
			reExps: [],
			exps: [],
		});
	});

	it("import inside string value", async () => {
		const params = createParams({
			content: `const foo = "import foo from 'foo';"`,
		});
		const impex = await parseFile(params);

		expect(impex).toEqual({
			imps: [],
			reExps: [],
			exps: [],
		});
	});

	it("static imports", async () => {
		const params = createParams({
			content: `
				import foo from "foo";
				import { 
					type Foo,
					Bar,
					qux as quux
				} from "../../bar";
				import * as baz from "@baz";
				import "qux";
			`.trim(),
		});
		const impex = await parseFile(params);

		expect(impex.imps).toEqual([{
			kind: "imp",
			isDynamic: false,
			locator: "foo",
			posSpan: { start: 0, end: 22 },
			values: ["default"],
		}, {
			kind: "imp",
			isDynamic: false,
			locator: "../../bar",
			posSpan: { start: 27, end: 102 },
			values: ["Foo", "Bar", "qux"],
		}, {
			kind: "imp",
			isDynamic: false,
			locator: "@baz",
			posSpan: { start: 107, end: 135 },
			values: ["*"],
		}, {
			kind: "imp",
			isDynamic: false,
			locator: "qux",
			posSpan: { start: 140, end: 153 },
			values: ["*"],
		}]);
	});

	it("dynamic imports", async () => {
		const params = createParams({
			content:
				'const t = "FOO"; const t2 = await import("./foo"); const t3 = await import(`foo`); await import(t);',
		});
		const impex = await parseFile(params);

		expect(impex.imps).toEqual([{
			kind: "imp",
			isDynamic: true,
			locator: "./foo",
			posSpan: { start: 34, end: 49 },
			values: ["*"],
		}, {
			kind: "imp",
			isDynamic: true,
			locator: "foo",
			posSpan: { start: 68, end: 81 },
			values: ["*"],
		}, {
			kind: "imp",
			isDynamic: true,
			locator: null,
			posSpan: { start: 89, end: 98 },
			values: ["*"],
		}]);
	});

	it("re-exports", async () => {
		const params = createParams({
			content: `
				export { default } from "./foo";
				export * from "../../../bar";
				export { A as foo, B as bar } from "baz"; 
				export { A as Foo };
			`,
		});
		const impex = await parseFile(params);

		expect(impex.reExps).toEqual([
			{
				kind: "re-exp",
				locator: "./foo",
				posSpan: { start: 5, end: 37 },
				lhValues: ["default"],
				rhValues: ["default"],
			},
			{
				kind: "re-exp",
				locator: "../../../bar",
				posSpan: { start: 42, end: 71 },
				lhValues: ["*"],
				rhValues: ["*"],
			},
			{
				kind: "re-exp",
				locator: "baz",
				posSpan: { start: 76, end: 117 },
				lhValues: ["A", "B"],
				rhValues: ["foo", "bar"],
			},
		]);
	});

	describe("import values", () => {
		it("dynamic import", async () => {
			const params = createParams({
				content: `const foo = await import("bar");`,
			});

			const impex = await parseFile(params);

			expect(impex.imps[0].values).toEqual(["*"]);
		});

		it("side-effect import", async () => {
			const params = createParams({
				content: `import "foo";`,
			});

			const impex = await parseFile(params);

			expect(impex.imps[0].values).toEqual(["*"]);
		});

		it("import default", async () => {
			const params = createParams({
				content: `import foo from "bar";`,
			});

			const impex = await parseFile(params);

			expect(impex.imps[0].values).toEqual(["default"]);
		});

		it("import all", async () => {
			const params = createParams({
				content: `import * as foo from "bar";`,
			});

			const impex = await parseFile(params);

			expect(impex.imps[0].values).toEqual(["*"]);
		});

		it("named import", async () => {
			const params = createParams({
				content: `import type { foo as Foo } from "bar";`,
			});

			const impex = await parseFile(params);

			expect(impex.imps[0].values).toEqual(["foo"]);
		});

		it("import all and default", async () => {
			const params = createParams({
				content: `import Foo, * as foo from "bar";`,
			});

			const impex = await parseFile(params);

			expect(impex.imps[0].values).toEqual(["*"]);
		});

		it("import with duplicates", async () => {
			const params = createParams({
				content: `import { default as foo, default as baz } from "bar";`,
			});

			const impex = await parseFile(params);

			expect(impex.imps[0].values).toEqual(["default"]);
		});

		it("import string literal", async () => {
			const params = createParams({
				content: `import { "foo" as foo } from "bar";`,
			});

			const impex = await parseFile(params);

			expect(impex.imps[0].values).toEqual(["foo"]);
		});

		it("static import complex case", async () => {
			const params = createParams({
				content: `import { "foo" as foo, type Bar, type Baz as Bazzz, default as quux } from "bar";`,
			});

			const impex = await parseFile(params);

			expect(impex.imps[0].values).toEqual(["foo", "Bar", "Baz", "default"]);
		});
	});

	describe("re-export values", () => {
		it("re-export all", async () => {
			const params = createParams({
				content: `export * from "foo";`,
			});

			const impex = await parseFile(params);
			const { lhValues, rhValues } = impex.reExps[0];

			expect(lhValues).toEqual(["*"]);
			expect(rhValues).toEqual(["*"]);
		});

		it("re-export all via namespace", async () => {
			const params = createParams({
				content: `export * as bar from "foo";`,
			});

			const impex = await parseFile(params);
			const { lhValues, rhValues } = impex.reExps[0];

			expect(lhValues).toEqual(["*"]);
			expect(rhValues).toEqual(["bar"]);
		});

		it("re-export default", async () => {
			const params = createParams({
				content: `export { default } from "foo";`,
			});

			const impex = await parseFile(params);
			const { lhValues, rhValues } = impex.reExps[0];

			expect(lhValues).toEqual(["default"]);
			expect(rhValues).toEqual(["default"]);
		});

		it("re-export default as alias", async () => {
			const params = createParams({
				content: `export { default as bar } from "foo";`,
			});

			const impex = await parseFile(params);
			const { lhValues, rhValues } = impex.reExps[0];

			expect(lhValues).toEqual(["default"]);
			expect(rhValues).toEqual(["bar"]);
		});

		it("re-export named variables", async () => {
			const params = createParams({
				content: `export { bar, baz, type Qux } from "foo";`,
			});

			const impex = await parseFile(params);
			const { lhValues, rhValues } = impex.reExps[0];

			expect(lhValues).toEqual(["bar", "baz", "Qux"]);
			expect(rhValues).toEqual(["bar", "baz", "Qux"]);
		});

		it("re-export named variables as aliases", async () => {
			const params = createParams({
				content: `export { bar as Baz, baz as Baz, type Qux as Quux } from "foo";`,
			});

			const impex = await parseFile(params);
			const { lhValues, rhValues } = impex.reExps[0];

			expect(lhValues).toEqual(["bar", "baz", "Qux"]);
			expect(rhValues).toEqual(["Baz", "Quux"]);
		});

		it("re-export complex case, ignore duplicates", async () => {
			const params = createParams({
				content: `export { default, default as bar, baz, type Qux } from "foo";`,
			});

			const impex = await parseFile(params);
			const { lhValues, rhValues } = impex.reExps[0];

			expect(lhValues).toEqual(["default", "baz", "Qux"]);
			expect(rhValues).toEqual(["default", "bar", "baz", "Qux"]);
		});
	});

	describe("export values", () => {
		it("default expression export", async () => {
			const params = createParams({
				content: `const foo = "foo"; export default foo;`,
			});

			const impex = await parseFile(params);
			const { lhValues, rhValues } = impex.exps[0];

			expect(lhValues).toEqual(["default"]);
			expect(rhValues).toEqual(["default"]);
		});

		it("default function export", async () => {
			const params = createParams({
				content: `export default function bar() {}`,
			});

			const impex = await parseFile(params);
			const { lhValues, rhValues } = impex.exps[0];

			expect(lhValues).toEqual(["default"]);
			expect(rhValues).toEqual(["default"]);
		});

		it("default class export", async () => {
			const params = createParams({
				content: `export default class Baz {}`,
			});

			const impex = await parseFile(params);
			const { lhValues, rhValues } = impex.exps[0];

			expect(lhValues).toEqual(["default"]);
			expect(rhValues).toEqual(["default"]);
		});

		it("empty export", async () => {
			const params = createParams({
				content: `export {}`,
			});

			const impex = await parseFile(params);
			const { lhValues, rhValues } = impex.exps[0];

			expect(lhValues).toEqual([]);
			expect(rhValues).toEqual([]);
		});

		it("export list", async () => {
			const params = createParams({
				content: `export { foo as default, bar, Baz as Qux, quux as "foo-bar" }`,
			});

			const impex = await parseFile(params);
			const { lhValues, rhValues } = impex.exps[0];

			expect(lhValues).toEqual(["foo", "bar", "Baz", "quux"]);
			expect(rhValues).toEqual(["default", "bar", "Qux", "foo-bar"]);
		});

		it("export enum", async () => {
			const params = createParams({
				content: `export enum Foo {}`,
			});

			const impex = await parseFile(params);
			const { lhValues, rhValues } = impex.exps[0];

			expect(lhValues).toEqual(["Foo"]);
			expect(rhValues).toEqual(["Foo"]);
		});

		it("export type", async () => {
			const params = createParams({
				content: `export type Bar = {}`,
			});

			const impex = await parseFile(params);
			const { lhValues, rhValues } = impex.exps[0];

			expect(lhValues).toEqual(["Bar"]);
			expect(rhValues).toEqual(["Bar"]);
		});

		it("export interface", async () => {
			const params = createParams({
				content: `export interface Baz {}`,
			});

			const impex = await parseFile(params);
			const { lhValues, rhValues } = impex.exps[0];

			expect(lhValues).toEqual(["Baz"]);
			expect(rhValues).toEqual(["Baz"]);
		});

		it("export function", async () => {
			const params = createParams({
				content: `export function foo() {}`,
			});

			const impex = await parseFile(params);
			const { lhValues, rhValues } = impex.exps[0];

			expect(lhValues).toEqual(["foo"]);
			expect(rhValues).toEqual(["foo"]);
		});

		it("export class", async () => {
			const params = createParams({
				content: `export class Foo {}`,
			});

			const impex = await parseFile(params);
			const { lhValues, rhValues } = impex.exps[0];

			expect(lhValues).toEqual(["Foo"]);
			expect(rhValues).toEqual(["Foo"]);
		});

		it("export declare function", async () => {
			const params = createParams({
				content: `export function bar(): string;`,
			});

			const impex = await parseFile(params);
			const { lhValues, rhValues } = impex.exps[0];

			expect(lhValues).toEqual(["bar"]);
			expect(rhValues).toEqual(["bar"]);
		});

		it("export module declaration", async () => {
			const params = createParams({
				content: `export namespace Foo {}`,
			});

			const impex = await parseFile(params);
			const { lhValues, rhValues } = impex.exps[0];

			expect(lhValues).toEqual(["Foo"]);
			expect(rhValues).toEqual(["Foo"]);
		});

		it("export import equals declaration", async () => {
			const params = createParams({
				content: `export import foo = require("fs");`,
			});

			const impex = await parseFile(params);
			const { lhValues, rhValues } = impex.exps[0];

			expect(lhValues).toEqual(["foo"]);
			expect(rhValues).toEqual(["foo"]);
		});

		it("export let declaration", async () => {
			const params = createParams({
				content: `export let foo = "bar", baz;`,
			});

			const impex = await parseFile(params);
			const { lhValues, rhValues } = impex.exps[0];

			expect(lhValues).toEqual(["foo", "baz"]);
			expect(rhValues).toEqual(["foo", "baz"]);
		});

		it("export const declaration", async () => {
			const params = createParams({
				content: `export const foo = "bar";`,
			});

			const impex = await parseFile(params);
			const { lhValues, rhValues } = impex.exps[0];

			expect(lhValues).toEqual(["foo"]);
			expect(rhValues).toEqual(["foo"]);
		});

		it("export function declaration", async () => {
			const params = createParams({
				content: `export function foo() {}`,
			});

			const impex = await parseFile(params);
			const { lhValues, rhValues } = impex.exps[0];

			expect(lhValues).toEqual(["foo"]);
			expect(rhValues).toEqual(["foo"]);
		});

		it("export class declaration", async () => {
			const params = createParams({
				content: `export class Foo {}`,
			});

			const impex = await parseFile(params);
			const { lhValues, rhValues } = impex.exps[0];

			expect(lhValues).toEqual(["Foo"]);
			expect(rhValues).toEqual(["Foo"]);
		});

		it("export object destructing", async () => {
			const params = createParams({
				content: `export const { foo, bar = 1, ...baz } = {}`,
			});

			const impex = await parseFile(params);
			const { lhValues, rhValues } = impex.exps[0];

			expect(lhValues).toEqual(["foo", "bar", "baz"]);
			expect(rhValues).toEqual(["foo", "bar", "baz"]);
		});

		it("export array destructing", async () => {
			const params = createParams({
				content: `export const [foo, bar = 1, ...baz] = []`,
			});

			const impex = await parseFile(params);
			const { lhValues, rhValues } = impex.exps[0];

			expect(lhValues).toEqual(["foo", "bar", "baz"]);
			expect(rhValues).toEqual(["foo", "bar", "baz"]);
		});
	});
});
