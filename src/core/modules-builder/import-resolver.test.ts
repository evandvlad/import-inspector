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
		const rec = createImportRec({
			isDynamic: true,
			locator: null,
			filePathRec: pathRecProvider.getFilePathRec("C:/foo/bar/foo.js"),
		});

		expect(resolver.resolve(rec)).toEqual(null);
	});

	it("relative local path", () => {
		const pathRecProvider = new PathRecProvider({
			filePaths: ["C:/foo/index.ts", "C:/foo/bar/baz.ts", "C:/foo/bar.ts"],
		});

		const resolver = new ImportResolver({ settings, pathRecProvider });
		const rec = createImportRec({
			locator: "../bar",
			filePathRec: pathRecProvider.getFilePathRec("C:/foo/bar/baz.ts"),
		});

		expect(resolver.resolve(rec)).toEqual({
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
		const rec = createImportRec({
			locator: "@foo/bar",
			filePathRec: pathRecProvider.getFilePathRec("C:/foo/index.ts"),
		});

		expect(resolver.resolve(rec)).toEqual({
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
		const rec = createImportRec({
			locator: "f",
			filePathRec: pathRecProvider.getFilePathRec("C:/foo/index.ts"),
		});

		expect(resolver.resolve(rec)).toEqual({
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
		const rec = createImportRec({
			locator: "@foo/baz",
			filePathRec: pathRecProvider.getFilePathRec("C:/foo/index.ts"),
		});

		expect(resolver.resolve(rec)).toEqual({
			isExternal: false,
			isRelative: false,
			path: null,
		});
	});

	it("external import", () => {
		const pathRecProvider = new PathRecProvider({ filePaths: ["C:/foo/index.ts", "C:/foo/bar.tsx"] });
		const resolver = new ImportResolver({ settings, pathRecProvider });
		const rec = createImportRec({
			locator: "react",
			filePathRec: pathRecProvider.getFilePathRec("C:/foo/bar.tsx"),
		});

		expect(resolver.resolve(rec)).toEqual({
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
			const rec = createImportRec({
				locator: ".",
				filePathRec: pathRecProvider.getFilePathRec("C:/foo/bar.tsx"),
			});

			expect(resolver.resolve(rec)).toEqual({
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
			const rec = createImportRec({
				locator: "..",
				filePathRec: pathRecProvider.getFilePathRec("C:/foo/bar/baz.js"),
			});

			expect(resolver.resolve(rec)).toEqual({
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

			const rec = createImportRec({
				locator: "../bar",
				filePathRec: pathRecProvider.getFilePathRec("C:/foo/qux/quux.ts"),
			});

			expect(resolver.resolve(rec)).toEqual({
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

			const rec = createImportRec({
				locator: "../bar",
				filePathRec: pathRecProvider.getFilePathRec("C:/foo/qux/quux.ts"),
			});

			expect(resolver.resolve(rec)).toEqual({
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

			const rec = createImportRec({
				locator: "../bar",
				filePathRec: pathRecProvider.getFilePathRec("C:/foo/qux/quux.ts"),
			});

			expect(resolver.resolve(rec)).toEqual({
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

			const rec = createImportRec({
				locator: "../bar",
				filePathRec: pathRecProvider.getFilePathRec("C:/foo/qux/quux.ts"),
			});

			expect(resolver.resolve(rec)).toEqual({
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

			const rec = createImportRec({
				locator: "../bar",
				filePathRec: pathRecProvider.getFilePathRec("C:/foo/qux/quux.ts"),
			});

			expect(resolver.resolve(rec)).toEqual({
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

			const rec = createImportRec({
				locator: "../bar",
				filePathRec: pathRecProvider.getFilePathRec("C:/foo/qux/quux.ts"),
			});

			expect(resolver.resolve(rec)).toEqual({
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

			const rec = createImportRec({
				locator: "../bar",
				filePathRec: pathRecProvider.getFilePathRec("C:/foo/qux/quux.ts"),
			});

			expect(resolver.resolve(rec)).toEqual({
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

			const rec = createImportRec({
				locator: "../bar",
				filePathRec: pathRecProvider.getFilePathRec("C:/foo/qux/quux.ts"),
			});

			expect(resolver.resolve(rec)).toEqual({
				isExternal: false,
				isRelative: true,
				path: "C:/foo/bar/index.d.ts",
			});
		});
	});
});
