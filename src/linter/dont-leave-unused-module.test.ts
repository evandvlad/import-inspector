import { describe, it } from "node:test";
import { expect } from "@std/expect";

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

		const paths = appContext.modDefects
			.byRule
			.getOrDefault("don't-leave-unused-module", undefined)
			?.map(({ mod }) => mod.path)
			.toArray();

		expect(paths).toEqual(undefined);
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

		const paths = appContext.modDefects
			.byRule
			.get("don't-leave-unused-module")
			.map(({ mod }) => mod.path)
			.toArray();

		expect(paths).toEqual(["C:/foo/bar/other.tsx"]);
	});
});
