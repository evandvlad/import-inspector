import type { LintFunction } from "~/values.ts";

export const dontLeaveUnusedModule: LintFunction = ({ mods }) => {
	mods.values()
		.filter((mod) => !mod.tags.has("independent") && mod.links.size === 0)
		.forEach((mod) => {
			mod.defects.add("don't-leave-unused-module");
		});
};
