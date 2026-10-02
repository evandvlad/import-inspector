import { ModuleLintRule, Tag } from "~/api.ts";

import type { LintFunction } from "../values.ts";

export const dontLeaveUnusedModule: LintFunction = ({ modules }) => {
	Iterator.from(modules.getAll())
		.filter((mod) => !mod.hasTag(Tag.Independent))
		.filter(({ links }) => links.length === 0)
		.forEach((mod) => {
			mod.addDefect({ rule: ModuleLintRule.DontLeaveUnusedModule });
		});
};
