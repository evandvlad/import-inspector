import { describe, it } from "node:test";
import { expect } from "@std/expect";

import { PathRecProvider } from "./index.ts";

describe("path-rec-provider", () => {
	const provider = new PathRecProvider({
		filePaths: [
			"C:/foo/bar/baz.ts",
			"C:/foo/bar/baz/qux.tsx",
			"C:/foo/bar/baz/quux.js",
			"C:/foo/bar/baz/qux/quux.d.ts",
		],
	});

	it("findPathRec", () => {
		expect(provider.findPathRec("C:/foo/bar/baz.ts")).not.toBeNull();
		expect(provider.findPathRec("C:/foo/bar/baz/qux")).not.toBeNull();
		expect(provider.findPathRec("C:/foo/bar/baz/unknown")).toBeNull();
		expect(provider.findPathRec("C:/foo/bar/baz/unknown/unknown/unknown")).toBeNull();
	});

	it("getPathRec", () => {
		expect(provider.getPathRec("C:/foo/bar/baz.ts")).not.toBeNull();

		expect(() => {
			provider.getPathRec("C:/foo/bar/baz/unknown");
		}).toThrow("Can't find entry by path 'C:/foo/bar/baz/unknown'.");
	});

	it("findFilePathRec", () => {
		expect(provider.findFilePathRec("C:/foo/bar/baz/quux.js")).not.toBeNull();
		expect(provider.findFilePathRec("C:/foo/bar/baz/unknown.ts")).toBeNull();
	});

	it("getFilePathRec", () => {
		expect(provider.getFilePathRec("C:/foo/bar/baz/quux.js")).not.toBeNull();

		expect(() => {
			provider.getFilePathRec("C:/foo/bar/baz");
		}).toThrow("Can't find file entry by path 'C:/foo/bar/baz'.");
	});

	it("can't find dir rec by file path", () => {
		expect(provider.findFilePathRec("C:/foo/bar/baz")).toBeNull();
	});

	it("findDirPathRec", () => {
		expect(provider.findDirPathRec("C:/foo/bar/baz")).not.toBeNull();
		expect(provider.findDirPathRec("C:/foo/bar/baz/")).not.toBeNull();
		expect(provider.findDirPathRec("C:/foo/bar/unknown")).toBeNull();
	});

	it("can't find file rec by dir path", () => {
		expect(provider.findDirPathRec("C:/foo/bar/baz.ts")).toBeNull();
	});

	it("getDirPathRec", () => {
		expect(provider.getDirPathRec("C:/foo/bar/baz")).not.toBeNull();

		expect(() => {
			provider.getDirPathRec("C:/foo/bar/baz/unknown");
		}).toThrow("Can't find dir entry by path 'C:/foo/bar/baz/unknown'.");
	});

	it("find file or dir path rec", () => {
		expect(provider.findFilePathRec("C:/foo/bar/baz/quux.js")).not.toBeNull();
		expect(provider.findDirPathRec("C:/foo/bar/baz/")).not.toBeNull();
		expect(provider.findDirPathRec("C:/foo/bar/baz/qux")).not.toBeNull();
	});

	it("dir path rec hierarchy data is correct", () => {
		const dirPathRec = provider.getDirPathRec("C:/foo/bar/baz");

		expect(dirPathRec.parentPath).toBe(null);
		expect(dirPathRec.childPaths).toEqual([
			"C:/foo/bar/baz/qux.tsx",
			"C:/foo/bar/baz/quux.js",
			"C:/foo/bar/baz/qux",
		]);
	});

	it("throws error if fewer than 2 paths are provided", () => {
		expect(() => {
			new PathRecProvider({ filePaths: [] });
		}).toThrow("At least 2 file paths are required, but got 0.");
	});

	it("createUpWalker", () => {
		const walker = provider.createUpWalker("C:/foo/bar/baz/qux/quux.d.ts");

		expect(Array.from(walker)).toEqual([
			provider.getFilePathRec("C:/foo/bar/baz/qux/quux.d.ts"),
			provider.getDirPathRec("C:/foo/bar/baz/qux"),
			provider.getDirPathRec("C:/foo/bar/baz"),
		]);
	});

	it("createDownWalker", () => {
		const walker = provider.createDownWalker("C:/foo/bar/baz");

		expect(Array.from(walker)).toEqual([
			provider.getFilePathRec("C:/foo/bar/baz/qux.tsx"),
			provider.getFilePathRec("C:/foo/bar/baz/quux.js"),
			provider.getDirPathRec("C:/foo/bar/baz/qux"),
			provider.getFilePathRec("C:/foo/bar/baz/qux/quux.d.ts"),
		]);
	});
});
