import { describe, it } from "@std/testing/bdd";
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

	it("find path rec", () => {
		expect(provider.findPathRec("C:/foo/bar/baz.ts")).not.toBeNull();
		expect(provider.findPathRec("C:/foo/bar/baz/qux")).not.toBeNull();
		expect(provider.findPathRec("C:/foo/bar/baz/unknown")).toBeNull();
		expect(provider.findPathRec("C:/foo/bar/baz/unknown/unknown/unknown")).toBeNull();
	});

	it("get path rec", () => {
		expect(provider.getPathRec("C:/foo/bar/baz.ts")).not.toBeNull();

		expect(() => {
			provider.getPathRec("C:/foo/bar/baz/unknown");
		}).toThrow("Can't find the path rec by the path 'C:/foo/bar/baz/unknown'.");
	});

	it("find file path rec", () => {
		expect(provider.findFilePathRec("C:/foo/bar/baz/quux.js")).not.toBeNull();
		expect(provider.findFilePathRec("C:/foo/bar.ts")).toBeNull();
	});

	it("get file path rec", () => {
		expect(provider.getFilePathRec("C:/foo/bar/baz/quux.js")).not.toBeNull();

		expect(() => {
			provider.getFilePathRec("C:/foo/bar/baz");
		}).toThrow("Can't find the file path rec by the path 'C:/foo/bar/baz'.");
	});

	it("can't find dir rec by file path", () => {
		expect(provider.findFilePathRec("C:/foo/bar/baz")).toBeNull();
	});

	it("find dir path rec", () => {
		expect(provider.findDirPathRec("C:/foo/bar/baz")).not.toBeNull();
		expect(provider.findDirPathRec("C:/foo/bar/baz/")).not.toBeNull();
		expect(provider.findDirPathRec("C:/foo/bar/unknown")).toBeNull();
	});

	it("can't find file rec by dir path", () => {
		expect(provider.findDirPathRec("C:/foo/bar.ts")).toBeNull();
	});

	it("get dir path rec", () => {
		expect(provider.getDirPathRec("C:/foo/bar/baz")).not.toBeNull();

		expect(() => {
			provider.getDirPathRec("C:/foo/bar/baz/unknown");
		}).toThrow("Can't find the dir path rec by the path 'C:/foo/bar/baz/unknown'.");
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

	it("throws an error if fewer than 2 paths are provided", () => {
		expect(() => {
			new PathRecProvider({ filePaths: [] });
		}).toThrow("More than one file path is required for file processing, but 0 were given.");
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
