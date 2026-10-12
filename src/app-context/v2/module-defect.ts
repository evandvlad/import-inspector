import type { Module_v2, ModuleDefect_v2 } from "~/api.ts";

export class ModuleDefect implements ModuleDefect_v2 {
	id;
	mod;
	rule;
	info;
	description;

	constructor(
		{ rule, mod, description = "" }: {
			rule: string;
			mod: Module_v2;
			description?: string;
		},
	) {
		this.id = crypto.randomUUID() as string;
		this.rule = rule;
		this.description = description;
		this.mod = mod;

		this.info = `${rule}${description ? ` (${description})` : ""}`;
	}
}
