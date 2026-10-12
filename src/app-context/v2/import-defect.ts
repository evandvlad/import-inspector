import type { Import_v2, ImportDefect_v2, Module_v2 } from "~/api.ts";

export class ImportDefect implements ImportDefect_v2 {
	id;
	imp;
	mod;
	rule;
	info;
	description;

	constructor(
		{ rule, imp, mod, description = "" }: {
			rule: string;
			imp: Import_v2;
			mod: Module_v2;
			description?: string;
		},
	) {
		this.id = crypto.randomUUID() as string;
		this.rule = rule;
		this.description = description;
		this.imp = imp;
		this.mod = mod;

		this.info = `${rule}${description ? ` (${description})` : ""}`;
	}
}
