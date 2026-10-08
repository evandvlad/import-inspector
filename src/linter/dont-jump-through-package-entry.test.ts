import { describe, it } from "node:test";
import { expect } from "@std/expect";

import { createAndFillAppContext } from "~/testing/app-context-maker.ts";
import { ImportLintRule } from "~/api.ts";

import { dontJumpThroughPackageEntry } from "./dont-jump-through-package-entry.ts";

describe("dont-jump-through-package-entry", () => {
	it("not ok for module imported from child package not via entry point", async () => {
		const appContext = await createAndFillAppContext({
			files: {
				"C:/tmp/main.ts": "",
				"C:/foo/bar.ts": 'import "@foo/baz/qux";',
				"C:/foo/baz/index.tsx": "",
				"C:/foo/baz/qux.ts": "",
			},
			aliases: { "@foo/": "C:/foo" },
		});

		dontJumpThroughPackageEntry(appContext);

		const paths = appContext.importDefects
			.sampleRules()
			.getModPaths(ImportLintRule.DontJumpThroughPackageEntry);

		expect(paths).toEqual(["C:/foo/bar.ts"]);
	});

	it("not ok for module imported from child package not via entry point #2 (source is in package)", async () => {
		const appContext = await createAndFillAppContext({
			files: {
				"C:/tmp/main.ts": "",
				"C:/foo/index.ts": "",
				"C:/foo/bar.ts": 'import "@foo/baz/qux";',
				"C:/foo/baz/index.tsx": "",
				"C:/foo/baz/qux.ts": "",
			},
			aliases: { "@foo/": "C:/foo" },
		});

		dontJumpThroughPackageEntry(appContext);

		const paths = appContext.importDefects
			.sampleRules()
			.getModPaths(ImportLintRule.DontJumpThroughPackageEntry);

		expect(paths).toEqual(["C:/foo/bar.ts"]);
	});

	it("not ok for module imported from descendant package", async () => {
		const appContext = await createAndFillAppContext({
			files: {
				"C:/tmp/main.ts": "",
				"C:/foo/bar.ts": 'import "@foo/baz/quux";',
				"C:/foo/baz/index.tsx": "",
				"C:/foo/baz/qux.ts": "",
				"C:/foo/baz/quux/index.ts": "",
			},
			aliases: { "@foo/": "C:/foo" },
		});

		dontJumpThroughPackageEntry(appContext);

		const paths = appContext.importDefects
			.sampleRules()
			.getModPaths(ImportLintRule.DontJumpThroughPackageEntry);

		expect(paths).toEqual(["C:/foo/bar.ts"]);
	});

	it("not ok for module imported from descendant package #2 (source is in package)", async () => {
		const appContext = await createAndFillAppContext({
			files: {
				"C:/tmp/main.ts": "",
				"C:/foo/index.ts": "",
				"C:/foo/bar.ts": 'import "@foo/baz/quux";',
				"C:/foo/baz/index.tsx": "",
				"C:/foo/baz/qux.ts": "",
				"C:/foo/baz/quux/index.ts": "",
			},
			aliases: { "@foo/": "C:/foo" },
		});

		dontJumpThroughPackageEntry(appContext);

		const paths = appContext.importDefects
			.sampleRules()
			.getModPaths(ImportLintRule.DontJumpThroughPackageEntry);

		expect(paths).toEqual(["C:/foo/bar.ts"]);
	});

	it("ok to import from child module via entry point", async () => {
		const appContext = await createAndFillAppContext({
			files: {
				"C:/tmp/main.ts": "",
				"C:/foo/bar.ts": 'import "@foo/baz/qux";',
				"C:/foo/baz/qux/index.ts": "",
				"C:/foo/baz/qux/quux.tsx": "",
			},
			aliases: { "@foo/": "C:/foo" },
		});

		dontJumpThroughPackageEntry(appContext);

		const paths = appContext.importDefects
			.sampleRules()
			.getModPaths(ImportLintRule.DontJumpThroughPackageEntry);

		expect(paths).toEqual([]);
	});

	it("ok to import from parent module", async () => {
		const appContext = await createAndFillAppContext({
			files: {
				"C:/tmp/main.ts": "",
				"C:/foo/index.ts": "",
				"C:/foo/bar.ts": "",
				"C:/foo/baz/index.ts": "",
				"C:/foo/baz/qux.tsx": 'import "@foo/bar";',
			},
			aliases: { "@foo/": "C:/foo" },
		});

		dontJumpThroughPackageEntry(appContext);

		const paths = appContext.importDefects
			.sampleRules()
			.getModPaths(ImportLintRule.DontJumpThroughPackageEntry);

		expect(paths).toEqual([]);
	});

	it("ok to import from ancestor module", async () => {
		const appContext = await createAndFillAppContext({
			files: {
				"C:/tmp/main.ts": "",
				"C:/foo/index.ts": "",
				"C:/foo/bar.ts": "",
				"C:/foo/baz/index.ts": "",
				"C:/foo/baz/qux/index.js": "",
				"C:/foo/baz/qux/quux.tsx": 'import "@foo/bar";',
			},
			aliases: { "@foo/": "C:/foo" },
		});

		dontJumpThroughPackageEntry(appContext);

		const paths = appContext.importDefects
			.sampleRules()
			.getModPaths(ImportLintRule.DontJumpThroughPackageEntry);

		expect(paths).toEqual([]);
	});

	it("ok if both modules are not in packages", async () => {
		const appContext = await createAndFillAppContext({
			files: {
				"C:/tmp/main.ts": "",
				"C:/foo/bar.ts": 'import "@foo/baz/qux";',
				"C:/foo/baz/qux.tsx": "",
			},
			aliases: { "@foo/": "C:/foo" },
		});

		dontJumpThroughPackageEntry(appContext);

		const paths = appContext.importDefects
			.sampleRules()
			.getModPaths(ImportLintRule.DontJumpThroughPackageEntry);

		expect(paths).toEqual([]);
	});

	it("ok if both modules are in same package", async () => {
		const appContext = await createAndFillAppContext({
			files: {
				"C:/tmp/main.ts": "",
				"C:/foo/index.ts": "",
				"C:/foo/bar.ts": 'import "@foo/baz/qux";',
				"C:/foo/baz/qux.tsx": "",
			},
			aliases: { "@foo/": "C:/foo" },
		});

		dontJumpThroughPackageEntry(appContext);

		const paths = appContext.importDefects
			.sampleRules()
			.getModPaths(ImportLintRule.DontJumpThroughPackageEntry);

		expect(paths).toEqual([]);
	});
});
