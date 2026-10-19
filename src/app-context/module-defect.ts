import type { Defects, Module, ModuleDefect as IModuleDefect } from "~/api.d.ts";

export class ModuleDefect implements IModuleDefect {
	id;
	mod;
	rule;
	info;
	defects;
	description;

	constructor({ rule, mod, defects, description = "" }: {
		rule: string;
		mod: Module;
		defects: Defects<IModuleDefect>;
		description?: string;
	}) {
		this.id = crypto.randomUUID() as string;
		this.rule = rule;
		this.mod = mod;
		this.defects = defects;
		this.description = description;

		this.info = `${rule}${description ? ` (${description})` : ""}`;
	}
}
