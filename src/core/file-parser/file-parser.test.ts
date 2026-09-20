import { describe, it } from "@std/testing/bdd";
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
		const importRecs = await parseFile(params);

		expect(importRecs).toEqual([]);
	});

	it("throw an error on file parsing", async () => {
		const params = createParams({ content: "parse error" });

		await expect(parseFile(params)).rejects.toThrow(
			"An error occurred while parsing the file 'C:/foo/bar.ts'. Expected a semicolon or an implicit semicolon after a statement, but found none\n  x Expected a semicolon or an implicit semicolon after a statement, but found\n  | none\n   ,-[C:/foo/bar.ts:1:6]\n 1 | parse error\n   :      ^\n   `----\n  help: Try inserting a semicolon here\n",
		);
	});

	it("no error for react syntax in the js file", async () => {
		const params = createParams({
			path: "C:/foo/bar.js",
			content: `
				export default function F() {
					return <div>Hello</div>;
				}
			`,
		});

		const importRecs = await parseFile(params);

		expect(importRecs).toEqual([]);
	});

	it("single line comment", async () => {
		const params = createParams({ content: `// import foo from "foo";` });
		const importRecs = await parseFile(params);

		expect(importRecs).toEqual([]);
	});

	it("multi-line comment", async () => {
		const params = createParams({
			content: `
			/** 
			 * import foo from "foo";
			 */
		`,
		});
		const importRecs = await parseFile(params);

		expect(importRecs).toEqual([]);
	});

	it("import inside string value", async () => {
		const params = createParams({
			content: `const foo = "import foo from 'foo';"`,
		});
		const importRecs = await parseFile(params);

		expect(importRecs).toEqual([]);
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
		const importRecs = await parseFile(params);

		expect(importRecs).toEqual([{
			isDynamic: false,
			locator: "foo",
			posSpan: { start: 0, end: 22 },
		}, {
			isDynamic: false,
			locator: "../../bar",
			posSpan: { start: 27, end: 102 },
		}, {
			isDynamic: false,
			locator: "@baz",
			posSpan: { start: 107, end: 135 },
		}, {
			isDynamic: false,
			locator: "qux",
			posSpan: { start: 140, end: 153 },
		}]);
	});

	it("dynamic imports", async () => {
		const params = createParams({
			content:
				'const t = "FOO"; const t2 = await import("./foo"); const t3 = await import(`foo`); await import(t);',
		});
		const importRecs = await parseFile(params);

		expect(importRecs).toEqual([{
			isDynamic: true,
			locator: "./foo",
			posSpan: { start: 34, end: 49 },
		}, {
			isDynamic: true,
			locator: "foo",
			posSpan: { start: 68, end: 81 },
		}, {
			isDynamic: true,
			locator: null,
			posSpan: { start: 89, end: 98 },
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
		const importRecs = await parseFile(params);

		expect(importRecs).toEqual([
			{
				isDynamic: false,
				locator: "./foo",
				posSpan: { start: 5, end: 37 },
			},
			{
				isDynamic: false,
				locator: "../../../bar",
				posSpan: { start: 42, end: 71 },
			},
			{
				isDynamic: false,
				locator: "baz",
				posSpan: { start: 76, end: 117 },
			},
		]);
	});
});
