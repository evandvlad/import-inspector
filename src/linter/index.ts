import type { AppContext } from "~/api.d.ts";
import type { Settings } from "~/settings.ts";
import { pub } from "~/program-events.ts";

import { dontJumpThroughPackageEntry } from "./dont-jump-through-package-entry.ts";
import { dontReferToPackageEntryInside } from "./dont-refer-to-package-entry-inside.ts";
import { dontImportEntryFile } from "./dont-import-entry-file.ts";
import { dontUseAbsolutePathInside } from "./dont-use-absolute-path-inside.ts";
import { dontLeaveUnusedModule } from "./dont-leave-unused-module.ts";

export async function lint(
	{ appContext, settings }: {
		appContext: AppContext;
		settings: Settings;
	},
) {
	pub.send("linter:started");

	pub.send("linter.pre-lint:started");
	await settings.preLint(appContext);
	pub.send("linter.pre-lint:finished");

	pub.send("linter.lint:started");

	await Array.fromAsync([
		{ name: "don't-jump-through-package-entry", fn: dontJumpThroughPackageEntry },
		{ name: "don't-refer-to-package-entry-inside", fn: dontReferToPackageEntryInside },
		{ name: "don't-import-entry-file", fn: dontImportEntryFile },
		{ name: "don't-use-absolute-path-inside", fn: dontUseAbsolutePathInside },
		{ name: "don't-leave-unused-module", fn: dontLeaveUnusedModule },
	], async ({ name, fn }) => {
		pub.send("linter.rule:started", name);
		await fn(appContext);
		pub.send("linter.rule:finished", name);
	});

	pub.send("linter.lint:finished");

	pub.send("linter.post-lint:started");
	await settings.postLint(appContext);
	pub.send("linter.post-lint:finished");

	pub.send("linter:finished");
}
