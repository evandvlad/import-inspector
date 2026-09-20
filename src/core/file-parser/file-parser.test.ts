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
			line: 1,
			sourcePath: params.path,
			isDynamic: false,
			locator: "foo",
			code: 'import foo from "foo";',
		}, {
			line: 2,
			sourcePath: params.path,
			isDynamic: false,
			locator: "../../bar",
			code: `import { 
					type Foo,
					Bar,
					qux as quux
				} from "../../bar";`,
		}, {
			line: 7,
			sourcePath: params.path,
			isDynamic: false,
			locator: "@baz",
			code: 'import * as baz from "@baz";',
		}, {
			line: 8,
			sourcePath: params.path,
			isDynamic: false,
			locator: "qux",
			code: 'import "qux";',
		}]);
	});

	it("dynamic imports", async () => {
		const params = createParams({
			content:
				'const t = "FOO"; const t2 = await import("./foo"); const t3 = await import(`foo`); await import(t);',
		});
		const importRecs = await parseFile(params);

		expect(importRecs).toEqual([{
			line: 1,
			sourcePath: params.path,
			isDynamic: true,
			locator: "./foo",
			code: 'import("./foo")',
		}, {
			line: 1,
			sourcePath: params.path,
			isDynamic: true,
			locator: "foo",
			code: "import(`foo`)",
		}, {
			line: 1,
			sourcePath: params.path,
			isDynamic: true,
			locator: null,
			code: "import(t)",
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
				line: 2,
				sourcePath: params.path,
				isDynamic: false,
				locator: "./foo",
				code: 'export { default } from "./foo";',
			},
			{
				line: 3,
				sourcePath: params.path,
				isDynamic: false,
				locator: "../../../bar",
				code: 'export * from "../../../bar";',
			},
			{
				line: 4,
				sourcePath: params.path,
				isDynamic: false,
				locator: "baz",
				code: 'export { A as foo, B as bar } from "baz";',
			},
		]);
	});
});
