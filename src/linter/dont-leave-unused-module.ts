import { ModuleLintRule, Tag } from "~/api.ts";
import type { LintFunction } from "~/values.ts";

export const dontLeaveUnusedModule: LintFunction = (appContext) => {
	appContext.v1.modules.values()
		.filter((mod) => !mod.hasTag(Tag.Independent))
		.filter(({ links }) => links.length === 0)
		.forEach((mod) => {
			mod.addDefect(ModuleLintRule.DontLeaveUnusedModule);
		});

	appContext.v2.mods.byPath
		.filter((mod) => !mod.tags.has(Tag.Independent) && mod.links.total === 0)
		.forEach((mod) => {
			mod.defects.add(ModuleLintRule.DontLeaveUnusedModule);
		});
};
