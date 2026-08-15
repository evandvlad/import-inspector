import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";

import { ImportInspectionRule } from "~/api.ts";

import { createContext } from "../../testing/context-maker.ts";

import { dontReferToPackageEntryInside } from "./dont-refer-to-package-entry-inside.ts";

describe("inspection-handlers/import-handlers/dont-refer-to-package-entry-inside", () => {
	it("via import '.'", async () => {
		const context = await createContext({
			localFs: {
				"C:/tmp/main.ts": "",
				"C:/foo/bar/index.ts": "",
				"C:/foo/bar/other.tsx": 'import ".";',
			},
		});

		dontReferToPackageEntryInside(context);

		const paths = context.importDefects
			.getModulesByRule(ImportInspectionRule.DontReferToPackageEntryInside)
			.map(({ path }) => path);

		expect(paths).toEqual(["C:/foo/bar/other.tsx"]);
	});

	it("via import './index'", async () => {
		const context = await createContext({
			localFs: {
				"C:/tmp/main.ts": "",
				"C:/foo/bar/index.ts": "",
				"C:/foo/bar/other.tsx": 'import "./index";',
			},
		});

		dontReferToPackageEntryInside(context);

		const paths = context.importDefects
			.getModulesByRule(ImportInspectionRule.DontReferToPackageEntryInside)
			.map(({ path }) => path);

		expect(paths).toEqual(["C:/foo/bar/other.tsx"]);
	});

	it("via import '..'", async () => {
		const context = await createContext({
			localFs: {
				"C:/tmp/main.ts": "",
				"C:/foo/bar/index.ts": "",
				"C:/foo/bar/baz/other.tsx": 'import "..";',
			},
		});

		dontReferToPackageEntryInside(context);

		const paths = context.importDefects
			.getModulesByRule(ImportInspectionRule.DontReferToPackageEntryInside)
			.map(({ path }) => path);

		expect(paths).toEqual(["C:/foo/bar/baz/other.tsx"]);
	});

	it("via import '../index'", async () => {
		const context = await createContext({
			localFs: {
				"C:/tmp/main.ts": "",
				"C:/foo/bar/index.ts": "",
				"C:/foo/bar/baz/other.tsx": 'import "../index";',
			},
		});

		dontReferToPackageEntryInside(context);

		const paths = context.importDefects
			.getModulesByRule(ImportInspectionRule.DontReferToPackageEntryInside)
			.map(({ path }) => path);

		expect(paths).toEqual(["C:/foo/bar/baz/other.tsx"]);
	});

	it("via alias to entry point", async () => {
		const context = await createContext({
			localFs: {
				"C:/tmp/main.ts": "",
				"C:/foo/bar/index.ts": "",
				"C:/foo/bar/baz/other.tsx": 'import "@foo/bar";',
			},
			aliases: { "@foo/": "C:/foo" },
		});

		dontReferToPackageEntryInside(context);

		const paths = context.importDefects
			.getModulesByRule(ImportInspectionRule.DontReferToPackageEntryInside)
			.map(({ path }) => path);

		expect(paths).toEqual(["C:/foo/bar/baz/other.tsx"]);
	});

	it("in deep nested structure", async () => {
		const context = await createContext({
			localFs: {
				"C:/tmp/main.ts": "",
				"C:/foo/bar/index.ts": "",
				"C:/foo/bar/baz/qux/index.ts": "",
				"C:/foo/bar/baz/qux/quux/index.ts": "",
				"C:/foo/bar/baz/qux/quux/other.tsx": 'import "@foo/bar";',
			},
			aliases: { "@foo/": "C:/foo" },
		});

		dontReferToPackageEntryInside(context);

		const paths = context.importDefects
			.getModulesByRule(ImportInspectionRule.DontReferToPackageEntryInside)
			.map(({ path }) => path);

		expect(paths).toEqual(["C:/foo/bar/baz/qux/quux/other.tsx"]);
	});

	it("ok", async () => {
		const context = await createContext({
			localFs: {
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

		dontReferToPackageEntryInside(context);

		const paths = context.importDefects
			.getModulesByRule(ImportInspectionRule.DontReferToPackageEntryInside)
			.map(({ path }) => path);

		expect(paths).toEqual([]);
	});
});
