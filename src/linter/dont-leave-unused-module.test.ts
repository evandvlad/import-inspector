import { describe, it } from "node:test";
import { expect } from "@std/expect";

import { ModuleLintRule } from "~/api.ts";
import { createAndFillAppContext } from "~/testing/app-context-maker.ts";

import { dontLeaveUnusedModule } from "./dont-leave-unused-module.ts";

describe("dont-leave-unused-module", () => {
	it("ignores test and entry files", async () => {
		const appContext = await createAndFillAppContext({
			files: {
				"C:/tmp/main.entry.ts": "",
				"C:/qux/quux.test.ts": "",
				"C:/foo/bar/baz.entry.ts": 'import "./other";',
				"C:/foo/bar/other.tsx": 'import "./baz.entry";',
			},
		});

		dontLeaveUnusedModule(appContext);

		const paths = appContext.moduleDefects
			.getByRule(ModuleLintRule.DontLeaveUnusedModule)
			.map(({ sourcePath }) => sourcePath);

		expect(paths).toEqual([]);
	});

	it("orphan files", async () => {
		const appContext = await createAndFillAppContext({
			files: {
				"C:/tmp/main.entry.ts": "",
				"C:/foo/bar/baz.entry.ts": "",
				"C:/foo/bar/other.tsx": 'import "./baz.entry";',
			},
		});

		dontLeaveUnusedModule(appContext);

		const paths = appContext.moduleDefects
			.getByRule(ModuleLintRule.DontLeaveUnusedModule)
			.map(({ sourcePath }) => sourcePath);

		expect(paths).toEqual(["C:/foo/bar/other.tsx"]);
	});
});
