import { describe, it } from "node:test";
import { expect } from "@std/expect";

import { ImportInspectionRule } from "~/api.ts";

import { createContext } from "../../testing/context-maker.ts";

import { dontImportEntryFile } from "./dont-import-entry-file.ts";

describe("inspection-handlers/import-handlers/dont-import-entry-file", () => {
	it("not ok", async () => {
		const context = await createContext({
			localFs: {
				"C:/tmp/main.ts": "",
				"C:/foo/bar/baz.entry.ts": "",
				"C:/foo/bar/other.tsx": 'import "./baz.entry";',
			},
		});

		dontImportEntryFile(context);

		const paths = context.importDefects
			.getModulePathsByRule(ImportInspectionRule.DontImportEntryFile);

		expect(paths).toEqual(["C:/foo/bar/other.tsx"]);
	});
});
