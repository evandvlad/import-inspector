import { ModuleLintRule, Tag } from "~/api.ts";
import type { LintFunction } from "~/values.ts";

export const dontLeaveUnusedModule: LintFunction = ({ mods }) => {
	mods.byPath
		.filter((mod) => !mod.tags.has(Tag.Independent) && mod.links.total === 0)
		.forEach((mod) => {
			mod.defects.add(ModuleLintRule.DontLeaveUnusedModule);
		});
};
