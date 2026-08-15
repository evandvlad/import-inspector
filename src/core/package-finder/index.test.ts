import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";

import { PathRecProvider } from "../path-rec-provider/index.ts";
import { PackageEntryPointDetector } from "../package-entry-point-detector/index.ts";

import { PackageFinder } from "./index.ts";

function createPackageFinder({ pathRecProvider }: { pathRecProvider: PathRecProvider }) {
	return new PackageFinder({
		pathRecProvider,
		packageEntryPointDetector: new PackageEntryPointDetector({ pathRecProvider }),
	});
}

describe("package-finder", () => {
	describe("findCurrent", () => {
		it("no package", () => {
			const pathRecProvider = new PathRecProvider({
				filePaths: ["C:/main.ts", "C:/foo/bar/qux.ts", "C:/foo/bar/quux.ts"],
			});

			const finder = createPackageFinder({ pathRecProvider });

			expect(finder.findCurrent("C:/foo/bar/qux.ts")).toEqual(null);
		});

		it("immediate package", () => {
			const pathRecProvider = new PathRecProvider({
				filePaths: ["C:/main.ts", "C:/foo/bar.ts", "C:/foo/index.ts"],
			});

			const finder = createPackageFinder({ pathRecProvider });

			expect(finder.findCurrent("C:/foo/index.ts")).toEqual("C:/foo");
		});

		it("far-away package", () => {
			const pathRecProvider = new PathRecProvider({
				filePaths: ["C:/foo/main.tsx", "C:/foo/bar/index.js", "C:/foo/bar/baz/qux/quux.ts"],
			});

			const finder = createPackageFinder({ pathRecProvider });

			expect(finder.findCurrent("C:/foo/bar/baz/qux/quux.ts")).toEqual("C:/foo/bar");
		});

		it("find from dir", () => {
			const pathRecProvider = new PathRecProvider({
				filePaths: ["C:/foo/main.tsx", "C:/foo/bar/index.js", "C:/foo/bar/baz/qux/quux.ts"],
			});

			const finder = createPackageFinder({ pathRecProvider });

			expect(finder.findCurrent("C:/foo/bar/baz/qux")).toEqual("C:/foo/bar");
		});

		it("complex case", () => {
			const pathRecProvider = new PathRecProvider({
				filePaths: [
					"C:/foo/index.tsx",
					"C:/foo/bar/index.tsx",
					"C:/foo/bar/baz/qux.index.ts",
					"C:/foo/bar/baz/index.qux.tsx",
					"C:/foo/bar/baz/main.ts",
					"C:/foo/bar/baz/qux/quux.ts",
				],
			});

			const finder = createPackageFinder({ pathRecProvider });

			expect(finder.findCurrent("C:/foo/bar/baz/qux/quux.ts")).toEqual("C:/foo/bar");
		});
	});

	describe("findChildren", () => {
		it("no immediate packages", () => {
			const pathRecProvider = new PathRecProvider({
				filePaths: [
					"C:/main.ts",
					"C:/foo/index.tsx",
					"C:/foo/baz.tsx",
					"C:/foo/bar/qux.ts",
				],
			});

			const finder = createPackageFinder({ pathRecProvider });

			expect(finder.findChildren("C:/foo")).toEqual([]);
		});

		it("1 immediate package", () => {
			const pathRecProvider = new PathRecProvider({
				filePaths: [
					"C:/main.ts",
					"C:/foo/index.tsx",
					"C:/foo/baz.tsx",
					"C:/foo/bar/qux.ts",
					"C:/foo/bar/index.d.ts",
				],
			});

			const finder = createPackageFinder({ pathRecProvider });

			expect(finder.findChildren("C:/foo")).toEqual([
				"C:/foo/bar",
			]);
		});

		it("2 immediate packages", () => {
			const pathRecProvider = new PathRecProvider({
				filePaths: [
					"C:/main.ts",
					"C:/foo/index.tsx",
					"C:/foo/baz.tsx",
					"C:/foo/bar/qux.ts",
					"C:/foo/bar/index.d.ts",
					"C:/foo/qux/qux.js",
					"C:/foo/qux/index.ts",
					"C:/foo/quux/quux/quux/quux.ts",
				],
			});

			const finder = createPackageFinder({ pathRecProvider });

			expect(finder.findChildren("C:/foo")).toEqual([
				"C:/foo/bar",
				"C:/foo/qux",
			]);
		});

		it("1 deep package", () => {
			const pathRecProvider = new PathRecProvider({
				filePaths: [
					"C:/main.ts",
					"C:/foo/index.tsx",
					"C:/foo/bar/bar.js",
					"C:/foo/bar/baz/baz.ts",
					"C:/foo/bar/baz/index.ts",
				],
			});

			const finder = createPackageFinder({ pathRecProvider });

			expect(finder.findChildren("C:/foo")).toEqual([
				"C:/foo/bar/baz",
			]);
		});

		it("1 deep package with sub package", () => {
			const pathRecProvider = new PathRecProvider({
				filePaths: [
					"C:/main.ts",
					"C:/foo/index.tsx",
					"C:/foo/bar/bar.js",
					"C:/foo/bar/baz/baz.ts",
					"C:/foo/bar/baz/index.ts",
					"C:/foo/bar/baz/qux/index.ts",
				],
			});

			const finder = createPackageFinder({ pathRecProvider });

			expect(finder.findChildren("C:/foo")).toEqual([
				"C:/foo/bar/baz",
			]);
		});

		it("2 packages at different depth levels", () => {
			const pathRecProvider = new PathRecProvider({
				filePaths: [
					"C:/main.ts",
					"C:/foo/index.tsx",
					"C:/foo/bar/bar.js",
					"C:/foo/bar/baz/baz.ts",
					"C:/foo/bar/baz/index.ts",
					"C:/foo/bar/qux/quux/foo/bar/index.ts",
				],
			});

			const finder = createPackageFinder({ pathRecProvider });

			expect(finder.findChildren("C:/foo")).toEqual([
				"C:/foo/bar/baz",
				"C:/foo/bar/qux/quux/foo/bar",
			]);
		});
	});
});
