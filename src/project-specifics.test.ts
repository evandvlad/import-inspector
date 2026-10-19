import { describe, it } from "node:test";
import { expect } from "@std/expect";

import {
	getFileLang,
	getImportPathSuffixCandidates,
	isDeclarationFile,
	isEntryPointFile,
	isIndependentFile,
	isTestFile,
} from "./project-specifics.ts";

describe("project-specifics", () => {
	it("getFileLang", () => {
		expect(getFileLang("/index.ts")).toBe("ts");
		expect(getFileLang("/index.tsx")).toBe("ts");
		expect(getFileLang("/index.js")).toBe("js");
		expect(getFileLang("/index.d.ts")).toBe("ts");
		expect(getFileLang("/index.test.ts")).toBe("ts");
	});

	it("getImportPathSuffixCandidates", () => {
		expect(getImportPathSuffixCandidates()).toEqual([
			".ts",
			".tsx",
			".js",
			".d.ts",
			"/index.ts",
			"/index.tsx",
			"/index.js",
			"/index.d.ts",
		]);
	});

	it("isEntryPointFile", () => {
		expect(isEntryPointFile("/index.entry.ts")).toBe(true);
		expect(isEntryPointFile("/foo.entry.ts")).toBe(true);
		expect(isEntryPointFile("/index.entry.js")).toBe(true);

		expect(isEntryPointFile("/index.ts")).toBe(false);
		expect(isEntryPointFile("/index.entry.test.ts")).toBe(false);
	});

	it("isTestFile", () => {
		expect(isTestFile("/index.test.ts")).toBe(true);

		expect(isTestFile("/test.tsx")).toBe(false);
		expect(isTestFile("/index.ts")).toBe(false);
	});

	it("isIndependentFile", () => {
		expect(isIndependentFile("/index.test.ts")).toBe(true);
		expect(isIndependentFile("/index.entry.tsx")).toBe(true);

		expect(isIndependentFile("/index.ts")).toBe(false);
	});

	it("isDeclarationFile", () => {
		expect(isDeclarationFile("/index.d.ts")).toBe(true);
		expect(isDeclarationFile("/foo.bar.d.ts")).toBe(true);

		expect(isDeclarationFile("/index.d.tsx")).toBe(false);
		expect(isDeclarationFile("/index.d.js")).toBe(false);
	});
});
