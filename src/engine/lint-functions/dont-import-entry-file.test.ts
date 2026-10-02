import { describe, it } from "node:test";
import { expect } from "@std/expect";

import { ImportLintRule } from "~/api.ts";

import { createContext } from "../testing/context-maker.ts";

import { dontImportEntryFile } from "./dont-import-entry-file.ts";

describe("dont-import-entry-file", () => {
	it("not ok", async () => {
		const context = await createContext({
			files: {
				"C:/tmp/main.ts": "",
				"C:/foo/bar/baz.entry.ts": "",
				"C:/foo/bar/other.tsx": 'import "./baz.entry";',
			},
		});

		dontImportEntryFile(context);

		const paths = context.importDefects
			.getModulePathsByRule(ImportLintRule.DontImportEntryFile);

		expect(paths).toEqual(["C:/foo/bar/other.tsx"]);
	});
});
