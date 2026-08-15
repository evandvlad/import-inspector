import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";

import { ImportInspectionRule } from "~/api.ts";

import { createContext } from "../../testing/context-maker.ts";

import { dontUseAbsolutePathInside } from "./dont-use-absolute-path-inside.ts";

describe("inspection-handlers/import-handlers/dont-use-absolute-path-inside", () => {
	it("not ok for absolute import from the same package", async () => {
		const context = await createContext({
			localFs: {
				"C:/tmp/main.ts": "",
				"C:/foo/bar.ts": "",
				"C:/foo/baz/index.tsx": 'import "@foo/baz/qux";',
				"C:/foo/baz/qux.ts": "",
			},
			aliases: { "@foo/": "C:/foo" },
		});

		dontUseAbsolutePathInside(context);

		const paths = context.importDefects
			.getModulesByRule(ImportInspectionRule.DontUseAbsolutePathInside)
			.map(({ path }) => path);

		expect(paths).toEqual(["C:/foo/baz/index.tsx"]);
	});

	it("not ok for absolute import from the ancestor package", async () => {
		const context = await createContext({
			localFs: {
				"C:/tmp/main.ts": "",
				"C:/foo/bar.ts": "",
				"C:/foo/baz/index.tsx": "",
				"C:/foo/baz/qux/index.ts": "",
				"C:/foo/baz/qux/quux/quuux.ts": 'import "@foo/baz";',
			},
			aliases: { "@foo/": "C:/foo" },
		});

		dontUseAbsolutePathInside(context);

		const paths = context.importDefects
			.getModulesByRule(ImportInspectionRule.DontUseAbsolutePathInside)
			.map(({ path }) => path);

		expect(paths).toEqual(["C:/foo/baz/qux/quux/quuux.ts"]);
	});

	it("ok for relative", async () => {
		const context = await createContext({
			localFs: {
				"C:/tmp/main.ts": "",
				"C:/foo/bar.ts": "",
				"C:/foo/baz/index.tsx": 'import "./qux";',
				"C:/foo/baz/qux.ts": "",
			},
		});

		dontUseAbsolutePathInside(context);

		const paths = context.importDefects
			.getModulesByRule(ImportInspectionRule.DontUseAbsolutePathInside)
			.map(({ path }) => path);

		expect(paths).toEqual([]);
	});

	it("ok for absolute", async () => {
		const context = await createContext({
			localFs: {
				"C:/tmp/main.ts": "",
				"C:/foo/bar.ts": "",
				"C:/foo/baz/index.tsx": "",
				"C:/foo/baz/qux.ts": "",
				"C:/foo/qux/quux.ts": 'import "@foo/baz";',
			},
			aliases: { "@foo/": "C:/foo" },
		});

		dontUseAbsolutePathInside(context);

		const paths = context.importDefects
			.getModulesByRule(ImportInspectionRule.DontUseAbsolutePathInside)
			.map(({ path }) => path);

		expect(paths).toEqual([]);
	});
});
