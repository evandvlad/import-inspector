import { describe, it } from "node:test";
import { expect } from "@std/expect";

import { ImportLintRule } from "~/api.ts";

import { createAppContext } from "../testing/app-context-maker.ts";

import { dontImportEntryFile } from "./dont-import-entry-file.ts";

describe("dont-import-entry-file", () => {
	it("not ok", async () => {
		const appContext = await createAppContext({
			files: {
				"C:/tmp/main.ts": "",
				"C:/foo/bar/baz.entry.ts": "",
				"C:/foo/bar/other.tsx": 'import "./baz.entry";',
			},
		});

		dontImportEntryFile(appContext);

		const paths = appContext.importDefects
			.getModulePathsByRule(ImportLintRule.DontImportEntryFile);

		expect(paths).toEqual(["C:/foo/bar/other.tsx"]);
	});
});
