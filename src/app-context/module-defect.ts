import type { ModuleDefect as IModuleDefect } from "~/api.ts";

export class ModuleDefect implements IModuleDefect {
	rule;
	sourcePath;
	description;

	info;

	constructor(
		{ rule, sourcePath, description = "" }: {
			rule: string;
			sourcePath: string;
			description?: string;
		},
	) {
		this.rule = rule;
		this.sourcePath = sourcePath;
		this.description = description;

		this.info = `${rule}${description ? ` (${description})` : ""}`;
	}
}
