import { ModuleInspectionRule, Tag } from "~/api.ts";

import type { InspectionHandler } from "../../values.ts";

export const dontLeaveUnusedModule: InspectionHandler = ({ modules }) => {
	Iterator.from(modules.getAll())
		.filter(({ tagSet }) => !tagSet.has(Tag.Independent))
		.filter(({ links }) => !links.length)
		.forEach((module) => {
			module.addDefect({ rule: ModuleInspectionRule.DontLeaveUnusedModule });
		});
};
