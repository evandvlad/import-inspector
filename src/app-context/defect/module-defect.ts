import type { Defects, Module, ModuleDefect as IModuleDefect } from "~/api.ts";

import { Defect } from "./defect.ts";

export class ModuleDefect extends Defect implements IModuleDefect {
	mod;
	defects;

	constructor({ rule, mod, defects, description = "" }: {
		rule: string;
		mod: Module;
		defects: Defects<IModuleDefect>;
		description?: string;
	}) {
		super({ rule, description });

		this.mod = mod;
		this.defects = defects;
	}
}
