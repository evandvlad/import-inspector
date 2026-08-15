import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";

import { PathRecProvider } from "../path-rec-provider/index.ts";

import { PackageEntryPointDetector } from "./index.ts";

describe("package-entry-point-detector", () => {
	describe("isOneOf", () => {
		it("all files can be entry points", () => {
			const filePaths = [
				"C:/foo/index.ts",
				"C:/foo/index.d.ts",
				"C:/foo/index.js",
				"C:/foo/index.tsx",
				"C:/foo/index.entry.ts",
				"C:/foo/index.entry.tsx",
				"C:/foo/index.entry.js",
			];

			const pathRecProvider = new PathRecProvider({ filePaths });
			const detector = new PackageEntryPointDetector({ pathRecProvider });

			const canEveryFileBeEntryPoint = filePaths.every((filePath) => detector.isOneOf(filePath));

			expect(canEveryFileBeEntryPoint).toBe(true);
		});

		it("no file can be an entry point", () => {
			const filePaths = [
				"C:/foo/main.ts",
				"C:/foo/index.entry.d.ts",
				"C:/foo/types.ts",
			];

			const pathRecProvider = new PathRecProvider({ filePaths });
			const detector = new PackageEntryPointDetector({ pathRecProvider });

			const canNoFileBeEntryPoint = filePaths.every((filePath) => !detector.isOneOf(filePath));

			expect(canNoFileBeEntryPoint).toBe(true);
		});
	});

	describe("selectFromChildren", () => {
		it("return null for no candidates", () => {
			const pathRecProvider = new PathRecProvider({
				filePaths: ["C:/main.ts", "C:/foo/bar.js", "C:/foo/baz.ts"],
			});

			const detector = new PackageEntryPointDetector({ pathRecProvider });

			expect(detector.selectFromChildren("C:/foo")).toBe(null);
		});

		it("return null for no files", () => {
			const pathRecProvider = new PathRecProvider({
				filePaths: ["C:/main.ts", "C:/foo/bar.js", "C:/foo/qux/quux/quuux.ts"],
			});

			const detector = new PackageEntryPointDetector({ pathRecProvider });

			expect(detector.selectFromChildren("C:/foo/qux")).toBe(null);
		});

		it("take 'index' first", () => {
			const pathRecProvider = new PathRecProvider({
				filePaths: ["C:/main.ts", "C:/foo/index.entry.ts", "C:/foo/index.d.ts", "C:/foo/index.ts"],
			});

			const detector = new PackageEntryPointDetector({ pathRecProvider });

			expect(detector.selectFromChildren("C:/foo")).toEqual("C:/foo/index.ts");
		});

		it("take 'index.d' second", () => {
			const pathRecProvider = new PathRecProvider({
				filePaths: ["C:/main.ts", "C:/foo/index.entry.ts", "C:/foo/index.d.ts", "C:/foo/bar.ts"],
			});

			const detector = new PackageEntryPointDetector({ pathRecProvider });

			expect(detector.selectFromChildren("C:/foo")).toEqual("C:/foo/index.d.ts");
		});

		it("take 'index.entry' third", () => {
			const pathRecProvider = new PathRecProvider({
				filePaths: ["C:/main.ts", "C:/foo/index.entry.ts", "C:/foo/baz.ts", "C:/foo/bar.ts"],
			});

			const detector = new PackageEntryPointDetector({ pathRecProvider });

			expect(detector.selectFromChildren("C:/foo")).toEqual("C:/foo/index.entry.ts");
		});
	});
});
