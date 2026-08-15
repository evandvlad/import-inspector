import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";

import { ModuleInspectionRule } from "~/api.ts";

import { createContext } from "../../testing/context-maker.ts";

import { dontLeaveUnusedModule } from "./dont-leave-unused-module.ts";

describe("inspection-handlers/module-handlers/dont-leave-unused-module", () => {
	it("ignores test and entry files", async () => {
		const context = await createContext({
			localFs: {
				"C:/tmp/main.entry.ts": "",
				"C:/qux/quux.test.ts": "",
				"C:/foo/bar/baz.entry.ts": 'import "./other";',
				"C:/foo/bar/other.tsx": 'import "./baz.entry";',
			},
		});

		dontLeaveUnusedModule(context);

		const paths = context.moduleDefects
			.getByRule(ModuleInspectionRule.DontLeaveUnusedModule)
			.map(({ sourcePath }) => sourcePath);

		expect(paths).toEqual([]);
	});

	it("orphan files", async () => {
		const context = await createContext({
			localFs: {
				"C:/tmp/main.entry.ts": "",
				"C:/foo/bar/baz.entry.ts": "",
				"C:/foo/bar/other.tsx": 'import "./baz.entry";',
			},
		});

		dontLeaveUnusedModule(context);

		const paths = context.moduleDefects
			.getByRule(ModuleInspectionRule.DontLeaveUnusedModule)
			.map(({ sourcePath }) => sourcePath);

		expect(paths).toEqual(["C:/foo/bar/other.tsx"]);
	});
});
