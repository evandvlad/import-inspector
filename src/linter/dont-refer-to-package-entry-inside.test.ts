import { describe, it } from "node:test";
import { expect } from "@std/expect";

import { createAndFillAppContext } from "~/testing/app-context-maker.ts";
import { ImportLintRule } from "~/api.ts";

import { dontReferToPackageEntryInside } from "./dont-refer-to-package-entry-inside.ts";

describe("dont-refer-to-package-entry-inside", () => {
	it("via import '.'", async () => {
		const appContext = await createAndFillAppContext({
			files: {
				"C:/tmp/main.ts": "",
				"C:/foo/bar/index.ts": "",
				"C:/foo/bar/other.tsx": 'import ".";',
			},
		});

		dontReferToPackageEntryInside(appContext);

		const paths = appContext.importDefects
			.sampleRules()
			.getModPaths(ImportLintRule.DontReferToPackageEntryInside);

		expect(paths).toEqual(["C:/foo/bar/other.tsx"]);
	});

	it("via import './index'", async () => {
		const appContext = await createAndFillAppContext({
			files: {
				"C:/tmp/main.ts": "",
				"C:/foo/bar/index.ts": "",
				"C:/foo/bar/other.tsx": 'import "./index";',
			},
		});

		dontReferToPackageEntryInside(appContext);

		const paths = appContext.importDefects
			.sampleRules()
			.getModPaths(ImportLintRule.DontReferToPackageEntryInside);

		expect(paths).toEqual(["C:/foo/bar/other.tsx"]);
	});

	it("via import '..'", async () => {
		const appContext = await createAndFillAppContext({
			files: {
				"C:/tmp/main.ts": "",
				"C:/foo/bar/index.ts": "",
				"C:/foo/bar/baz/other.tsx": 'import "..";',
			},
		});

		dontReferToPackageEntryInside(appContext);

		const paths = appContext.importDefects
			.sampleRules()
			.getModPaths(ImportLintRule.DontReferToPackageEntryInside);

		expect(paths).toEqual(["C:/foo/bar/baz/other.tsx"]);
	});

	it("via import '../index'", async () => {
		const appContext = await createAndFillAppContext({
			files: {
				"C:/tmp/main.ts": "",
				"C:/foo/bar/index.ts": "",
				"C:/foo/bar/baz/other.tsx": 'import "../index";',
			},
		});

		dontReferToPackageEntryInside(appContext);

		const paths = appContext.importDefects
			.sampleRules()
			.getModPaths(ImportLintRule.DontReferToPackageEntryInside);

		expect(paths).toEqual(["C:/foo/bar/baz/other.tsx"]);
	});

	it("via alias to entry point", async () => {
		const appContext = await createAndFillAppContext({
			files: {
				"C:/tmp/main.ts": "",
				"C:/foo/bar/index.ts": "",
				"C:/foo/bar/baz/other.tsx": 'import "@foo/bar";',
			},
			aliases: { "@foo/": "C:/foo" },
		});

		dontReferToPackageEntryInside(appContext);

		const paths = appContext.importDefects
			.sampleRules()
			.getModPaths(ImportLintRule.DontReferToPackageEntryInside);

		expect(paths).toEqual(["C:/foo/bar/baz/other.tsx"]);
	});

	it("in deep nested structure", async () => {
		const appContext = await createAndFillAppContext({
			files: {
				"C:/tmp/main.ts": "",
				"C:/foo/bar/index.ts": "",
				"C:/foo/bar/baz/qux/index.ts": "",
				"C:/foo/bar/baz/qux/quux/index.ts": "",
				"C:/foo/bar/baz/qux/quux/other.tsx": 'import "@foo/bar";',
			},
			aliases: { "@foo/": "C:/foo" },
		});

		dontReferToPackageEntryInside(appContext);

		const paths = appContext.importDefects
			.sampleRules()
			.getModPaths(ImportLintRule.DontReferToPackageEntryInside);

		expect(paths).toEqual(["C:/foo/bar/baz/qux/quux/other.tsx"]);
	});

	it("ok", async () => {
		const appContext = await createAndFillAppContext({
			files: {
				"C:/tmp/main.ts": 'import "./other";',
				"C:/tmp/other/index.ts": "",
				"C:/foo/bar/index.ts": "",
				"C:/foo/bar/baz/qux/index.ts": `
					const locator = "some";
					await import(locator);
				`,
				"C:/foo/bar/baz/qux/quux/index.ts": 'import "./other";',
				"C:/foo/bar/baz/qux/quux/other.tsx": 'import "react";',
			},
		});

		dontReferToPackageEntryInside(appContext);

		const paths = appContext.importDefects
			.sampleRules()
			.getModPaths(ImportLintRule.DontReferToPackageEntryInside);

		expect(paths).toEqual([]);
	});
});
