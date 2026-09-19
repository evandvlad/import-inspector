import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";

import { PathRecProvider } from "../path-rec-provider/index.ts";
import { createSettings } from "../testing/settings-maker.ts";
import { createImportRec } from "../testing/import-rec-maker.ts";

import { ImportResolver } from "./import-resolver.ts";

describe("import-resolver", () => {
	const settings = createSettings({
		rootEntries: [{ path: "C:/foo", alias: "@foo/" }],
		importRemaps: { "f": "C:/f" },
	});

	it("dynamic import without locator", () => {
		const pathRecProvider = new PathRecProvider({ filePaths: ["C:/foo/bar/index.ts", "C:/foo/bar/foo.js"] });
		const resolver = new ImportResolver({ settings, pathRecProvider });
		const importRec = createImportRec({
			isDynamic: true,
			locator: null,
		});

		expect(resolver.resolve({ path: "C:/foo/bar/foo.js", importRec })).toEqual(null);
	});

	it("relative local path", () => {
		const pathRecProvider = new PathRecProvider({
			filePaths: ["C:/foo/index.ts", "C:/foo/bar/baz.ts", "C:/foo/bar.ts"],
		});

		const resolver = new ImportResolver({ settings, pathRecProvider });
		const importRec = createImportRec({
			locator: "../bar",
		});

		expect(resolver.resolve({ path: "C:/foo/bar/baz.ts", importRec })).toEqual({
			isExternal: false,
			isRelative: true,
			path: "C:/foo/bar.ts",
		});
	});

	it("absolute local path", () => {
		const pathRecProvider = new PathRecProvider({
			filePaths: ["C:/foo/index.ts", "C:/foo/bar.ts"],
		});

		const resolver = new ImportResolver({ settings, pathRecProvider });
		const importRec = createImportRec({
			locator: "@foo/bar",
		});

		expect(resolver.resolve({ path: "C:/foo/index.ts", importRec })).toEqual({
			isExternal: false,
			isRelative: false,
			path: "C:/foo/bar.ts",
		});
	});

	it("absolute local path with remapping", () => {
		const pathRecProvider = new PathRecProvider({
			filePaths: ["C:/foo/index.ts", "C:/foo/bar.ts", "C:/f/index.ts"],
		});

		const resolver = new ImportResolver({ settings, pathRecProvider });
		const importRec = createImportRec({
			locator: "f",
		});

		expect(resolver.resolve({ path: "C:/foo/index.ts", importRec })).toEqual({
			isExternal: false,
			isRelative: false,
			path: "C:/f/index.ts",
		});
	});

	it("incorrect absolute local path", () => {
		const pathRecProvider = new PathRecProvider({
			filePaths: ["C:/foo/index.ts", "C:/foo/bar.ts"],
		});

		const resolver = new ImportResolver({ settings, pathRecProvider });
		const importRec = createImportRec({
			locator: "@foo/baz",
		});

		expect(resolver.resolve({ path: "C:/foo/index.ts", importRec })).toEqual({
			isExternal: false,
			isRelative: false,
			path: null,
		});
	});

	it("external import", () => {
		const pathRecProvider = new PathRecProvider({ filePaths: ["C:/foo/index.ts", "C:/foo/bar.tsx"] });
		const resolver = new ImportResolver({ settings, pathRecProvider });
		const importRec = createImportRec({
			locator: "react",
		});

		expect(resolver.resolve({ path: "C:/foo/bar.tsx", importRec })).toEqual({
			isExternal: true,
			isRelative: false,
			path: null,
		});
	});

	describe("import edge cases", () => {
		it("import '.'", () => {
			const pathRecProvider = new PathRecProvider({
				filePaths: ["C:/foo/bar.tsx", "C:/foo/index.ts"],
			});

			const resolver = new ImportResolver({ settings, pathRecProvider });
			const importRec = createImportRec({
				locator: ".",
			});

			expect(resolver.resolve({ path: "C:/foo/bar.tsx", importRec })).toEqual({
				isExternal: false,
				isRelative: true,
				path: "C:/foo/index.ts",
			});
		});

		it("import '..'", () => {
			const pathRecProvider = new PathRecProvider({
				filePaths: ["C:/foo/bar/baz.js", "C:/foo/index.ts"],
			});

			const resolver = new ImportResolver({ settings, pathRecProvider });
			const importRec = createImportRec({
				locator: "..",
			});

			expect(resolver.resolve({ path: "C:/foo/bar/baz.js", importRec })).toEqual({
				isExternal: false,
				isRelative: true,
				path: "C:/foo/index.ts",
			});
		});
	});

	describe("resolution order", () => {
		it("take .ts first", () => {
			const pathRecProvider = new PathRecProvider({
				filePaths: [
					"C:/foo/bar.ts",
					"C:/foo/bar.tsx",
					"C:/foo/bar.js",
					"C:/foo/bar.d.ts",
					"C:/foo/bar/index.ts",
					"C:/foo/bar/index.tsx",
					"C:/foo/bar/index.js",
					"C:/foo/bar/index.d.ts",
					"C:/foo/qux/quux.ts",
				],
			});

			const resolver = new ImportResolver({ settings, pathRecProvider });

			const importRec = createImportRec({
				locator: "../bar",
			});

			expect(resolver.resolve({ path: "C:/foo/qux/quux.ts", importRec })).toEqual({
				isExternal: false,
				isRelative: true,
				path: "C:/foo/bar.ts",
			});
		});

		it("take .tsx second", () => {
			const pathRecProvider = new PathRecProvider({
				filePaths: [
					"C:/foo/bar.tsx",
					"C:/foo/bar.js",
					"C:/foo/bar.d.ts",
					"C:/foo/bar/index.ts",
					"C:/foo/bar/index.tsx",
					"C:/foo/bar/index.js",
					"C:/foo/bar/index.d.ts",
					"C:/foo/qux/quux.ts",
				],
			});

			const resolver = new ImportResolver({ settings, pathRecProvider });

			const importRec = createImportRec({
				locator: "../bar",
			});

			expect(resolver.resolve({ path: "C:/foo/qux/quux.ts", importRec })).toEqual({
				isExternal: false,
				isRelative: true,
				path: "C:/foo/bar.tsx",
			});
		});

		it("take .js third", () => {
			const pathRecProvider = new PathRecProvider({
				filePaths: [
					"C:/foo/bar.js",
					"C:/foo/bar.d.ts",
					"C:/foo/bar/index.ts",
					"C:/foo/bar/index.tsx",
					"C:/foo/bar/index.js",
					"C:/foo/bar/index.d.ts",
					"C:/foo/qux/quux.ts",
				],
			});

			const resolver = new ImportResolver({ settings, pathRecProvider });

			const importRec = createImportRec({
				locator: "../bar",
			});

			expect(resolver.resolve({ path: "C:/foo/qux/quux.ts", importRec })).toEqual({
				isExternal: false,
				isRelative: true,
				path: "C:/foo/bar.js",
			});
		});

		it("take .d.ts fourth", () => {
			const pathRecProvider = new PathRecProvider({
				filePaths: [
					"C:/foo/bar.d.ts",
					"C:/foo/bar/index.ts",
					"C:/foo/bar/index.tsx",
					"C:/foo/bar/index.js",
					"C:/foo/bar/index.d.ts",
					"C:/foo/qux/quux.ts",
				],
			});

			const resolver = new ImportResolver({ settings, pathRecProvider });

			const importRec = createImportRec({
				locator: "../bar",
			});

			expect(resolver.resolve({ path: "C:/foo/qux/quux.ts", importRec })).toEqual({
				isExternal: false,
				isRelative: true,
				path: "C:/foo/bar.d.ts",
			});
		});

		it("take index.ts fifth", () => {
			const pathRecProvider = new PathRecProvider({
				filePaths: [
					"C:/foo/bar/index.ts",
					"C:/foo/bar/index.tsx",
					"C:/foo/bar/index.js",
					"C:/foo/bar/index.d.ts",
					"C:/foo/qux/quux.ts",
				],
			});

			const resolver = new ImportResolver({ settings, pathRecProvider });

			const importRec = createImportRec({
				locator: "../bar",
			});

			expect(resolver.resolve({ path: "C:/foo/qux/quux.ts", importRec })).toEqual({
				isExternal: false,
				isRelative: true,
				path: "C:/foo/bar/index.ts",
			});
		});

		it("take index.tsx sixth", () => {
			const pathRecProvider = new PathRecProvider({
				filePaths: [
					"C:/foo/bar/index.tsx",
					"C:/foo/bar/index.js",
					"C:/foo/bar/index.d.ts",
					"C:/foo/qux/quux.ts",
				],
			});

			const resolver = new ImportResolver({ settings, pathRecProvider });

			const importRec = createImportRec({
				locator: "../bar",
			});

			expect(resolver.resolve({ path: "C:/foo/qux/quux.ts", importRec })).toEqual({
				isExternal: false,
				isRelative: true,
				path: "C:/foo/bar/index.tsx",
			});
		});

		it("take index.js seventh", () => {
			const pathRecProvider = new PathRecProvider({
				filePaths: [
					"C:/foo/bar/index.js",
					"C:/foo/bar/index.d.ts",
					"C:/foo/qux/quux.ts",
				],
			});

			const resolver = new ImportResolver({ settings, pathRecProvider });

			const importRec = createImportRec({
				locator: "../bar",
			});

			expect(resolver.resolve({ path: "C:/foo/qux/quux.ts", importRec })).toEqual({
				isExternal: false,
				isRelative: true,
				path: "C:/foo/bar/index.js",
			});
		});

		it("take index.d.ts eighth", () => {
			const pathRecProvider = new PathRecProvider({
				filePaths: [
					"C:/foo/bar/index.d.ts",
					"C:/foo/qux/quux.ts",
				],
			});

			const resolver = new ImportResolver({ settings, pathRecProvider });

			const importRec = createImportRec({
				locator: "../bar",
			});

			expect(resolver.resolve({ path: "C:/foo/qux/quux.ts", importRec })).toEqual({
				isExternal: false,
				isRelative: true,
				path: "C:/foo/bar/index.d.ts",
			});
		});
	});
});
