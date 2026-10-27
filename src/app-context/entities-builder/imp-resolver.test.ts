import { describe, it } from "node:test";
import { expect } from "@std/expect";

import { createSettings } from "~/testing/settings-maker.ts";

import { PathRecProvider } from "./path-rec-provider/index.ts";
import { ImpResolver } from "./imp-resolver.ts";

describe("imp-resolver", () => {
	const settings = createSettings({
		rootEntries: [{ path: "C:/foo", alias: "@foo/" }],
		importRemaps: { "f": "C:/f" },
	});

	it("dynamic import without locator", () => {
		const pathRecProvider = new PathRecProvider({ filePaths: ["C:/foo/bar/index.ts", "C:/foo/bar/foo.js"] });
		const resolver = new ImpResolver({ settings, pathRecProvider });

		expect(resolver.resolve({ path: "C:/foo/bar/foo.js", locator: null })).toEqual(null);
	});

	it("relative local path", () => {
		const pathRecProvider = new PathRecProvider({
			filePaths: ["C:/foo/index.ts", "C:/foo/bar/baz.ts", "C:/foo/bar.ts"],
		});

		const resolver = new ImpResolver({ settings, pathRecProvider });

		expect(resolver.resolve({ path: "C:/foo/bar/baz.ts", locator: "../bar" })).toEqual({
			isExternal: false,
			isRelative: true,
			path: "C:/foo/bar.ts",
		});
	});

	it("absolute local path", () => {
		const pathRecProvider = new PathRecProvider({
			filePaths: ["C:/foo/index.ts", "C:/foo/bar.ts"],
		});

		const resolver = new ImpResolver({ settings, pathRecProvider });

		expect(resolver.resolve({ path: "C:/foo/index.ts", locator: "@foo/bar" })).toEqual({
			isExternal: false,
			isRelative: false,
			path: "C:/foo/bar.ts",
		});
	});

	it("absolute local path with remapping", () => {
		const pathRecProvider = new PathRecProvider({
			filePaths: ["C:/foo/index.ts", "C:/foo/bar.ts", "C:/f/index.ts"],
		});

		const resolver = new ImpResolver({ settings, pathRecProvider });

		expect(resolver.resolve({ path: "C:/foo/index.ts", locator: "f" })).toEqual({
			isExternal: false,
			isRelative: false,
			path: "C:/f/index.ts",
		});
	});

	it("incorrect absolute local path", () => {
		const pathRecProvider = new PathRecProvider({
			filePaths: ["C:/foo/index.ts", "C:/foo/bar.ts"],
		});

		const resolver = new ImpResolver({ settings, pathRecProvider });

		expect(resolver.resolve({ path: "C:/foo/index.ts", locator: "@foo/baz" })).toEqual({
			isExternal: false,
			isRelative: false,
			path: null,
		});
	});

	it("external import", () => {
		const pathRecProvider = new PathRecProvider({ filePaths: ["C:/foo/index.ts", "C:/foo/bar.tsx"] });
		const resolver = new ImpResolver({ settings, pathRecProvider });

		expect(resolver.resolve({ path: "C:/foo/bar.tsx", locator: "react" })).toEqual({
			isExternal: true,
			isRelative: false,
			path: null,
		});
	});

	describe("import edge cases", () => {
		it("import '.'", () => {
			const pathRecProvider = new PathRecProvider({
				filePaths: ["C:/index.ts", "C:/foo/bar/baz.tsx", "C:/foo/bar/index.ts"],
			});

			const resolver = new ImpResolver({ settings, pathRecProvider });

			expect(resolver.resolve({ path: "C:/foo/bar/baz.tsx", locator: "." })).toEqual({
				isExternal: false,
				isRelative: true,
				path: "C:/foo/bar/index.ts",
			});
		});

		it("import '..'", () => {
			const pathRecProvider = new PathRecProvider({
				filePaths: ["C:/index.ts", "C:/foo/bar/baz/qux.js", "C:/foo/bar/index.ts"],
			});

			const resolver = new ImpResolver({ settings, pathRecProvider });

			expect(resolver.resolve({ path: "C:/foo/bar/baz/qux.js", locator: ".." })).toEqual({
				isExternal: false,
				isRelative: true,
				path: "C:/foo/bar/index.ts",
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

			const resolver = new ImpResolver({ settings, pathRecProvider });

			expect(resolver.resolve({ path: "C:/foo/qux/quux.ts", locator: "../bar" })).toEqual({
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

			const resolver = new ImpResolver({ settings, pathRecProvider });

			expect(resolver.resolve({ path: "C:/foo/qux/quux.ts", locator: "../bar" })).toEqual({
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

			const resolver = new ImpResolver({ settings, pathRecProvider });

			expect(resolver.resolve({ path: "C:/foo/qux/quux.ts", locator: "../bar" })).toEqual({
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

			const resolver = new ImpResolver({ settings, pathRecProvider });

			expect(resolver.resolve({ path: "C:/foo/qux/quux.ts", locator: "../bar" })).toEqual({
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

			const resolver = new ImpResolver({ settings, pathRecProvider });

			expect(resolver.resolve({ path: "C:/foo/qux/quux.ts", locator: "../bar" })).toEqual({
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

			const resolver = new ImpResolver({ settings, pathRecProvider });

			expect(resolver.resolve({ path: "C:/foo/qux/quux.ts", locator: "../bar" })).toEqual({
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

			const resolver = new ImpResolver({ settings, pathRecProvider });

			expect(resolver.resolve({ path: "C:/foo/qux/quux.ts", locator: "../bar" })).toEqual({
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

			const resolver = new ImpResolver({ settings, pathRecProvider });

			expect(resolver.resolve({ path: "C:/foo/qux/quux.ts", locator: "../bar" })).toEqual({
				isExternal: false,
				isRelative: true,
				path: "C:/foo/bar/index.d.ts",
			});
		});
	});
});
