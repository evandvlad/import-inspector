import type { Defects, Mod, ModDefect as IModDefect } from "~/api.d.ts";

export class ModDefect implements IModDefect {
	id;
	mod;
	rule;
	info;
	defects;
	description;

	constructor({ rule, mod, defects, description = "" }: {
		rule: string;
		mod: Mod;
		defects: Defects<IModDefect>;
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
