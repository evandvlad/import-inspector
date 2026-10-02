import { ModuleInspectionRule, Tag } from "~/api.ts";

import type { InspectionHandler } from "../../values.ts";

export const dontLeaveUnusedModule: InspectionHandler = ({ modules }) => {
	Iterator.from(modules.getAll())
		.filter((mod) => !mod.hasTag(Tag.Independent))
		.filter(({ links }) => links.length === 0)
		.forEach((mod) => {
			mod.addDefect({ rule: ModuleInspectionRule.DontLeaveUnusedModule });
		});
};
