import type { ModuleDefect_v1 } from "~/api.ts";

export class ModuleDefect implements ModuleDefect_v1 {
	rule;
	source;
	description;

	info;

	constructor(
		{ rule, source, description = "" }: {
			rule: string;
			source: string;
			description?: string;
		},
	) {
		this.rule = rule;
		this.source = source;
		this.description = description;

		this.info = `${rule}${description ? ` (${description})` : ""}`;
	}
}
