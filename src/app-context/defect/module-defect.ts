import type { Module, ModuleDefect as IModuleDefect } from "~/api.ts";

import { Defect } from "./defect.ts";

export class ModuleDefect extends Defect implements IModuleDefect {
	mod;

	constructor({ rule, mod, description = "" }: {
		rule: string;
		mod: Module;
		description?: string;
	}) {
		super({ rule, description });

		this.mod = mod;
	}
}
