import type { Import_v2, ImportDefect_v2, Module_v2, ModuleDefect_v2 } from "~/api.ts";

abstract class Defect {
	id;
	mod;
	rule;
	info;
	description;

	constructor({ rule, mod, description = "" }: { rule: string; mod: Module_v2; description?: string }) {
		this.id = crypto.randomUUID() as string;
		this.rule = rule;
		this.description = description;
		this.mod = mod;

		this.info = `${rule}${description ? ` (${description})` : ""}`;
	}
}

export class ModuleDefect extends Defect implements ModuleDefect_v2 {}

export class ImportDefect extends Defect implements ImportDefect_v2 {
	imp;

	constructor({ rule, imp, mod, description = "" }: {
		rule: string;
		imp: Import_v2;
		mod: Module_v2;
		description?: string;
	}) {
		super({ rule, mod, description });

		this.imp = imp;
	}
}
