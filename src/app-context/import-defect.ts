import type { Defects, Import, ImportDefect as IImportDefect, Module } from "~/api.d.ts";

export class ImportDefect implements IImportDefect {
	id;
	imp;
	mod;
	rule;
	info;
	defects;
	description;

	constructor({ rule, imp, mod, defects, description = "" }: {
		rule: string;
		imp: Import;
		mod: Module;
		defects: Defects<IImportDefect>;
		description?: string;
	}) {
		this.id = crypto.randomUUID() as string;
		this.imp = imp;
		this.mod = mod;
		this.rule = rule;
		this.defects = defects;
		this.description = description;

		this.info = `${rule}${description ? ` (${description})` : ""}`;
	}
}
