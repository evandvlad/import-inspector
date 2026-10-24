import type { Defects, Imp, ImpDefect as IImpDefect, Mod } from "~/api.d.ts";

export class ImpDefect implements IImpDefect {
	id;
	imp;
	mod;
	rule;
	info;
	defects;
	description;

	constructor({ rule, imp, mod, defects, description = "" }: {
		rule: string;
		imp: Imp;
		mod: Mod;
		defects: Defects<IImpDefect>;
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
