import type { Module_v2, ModuleDefect_v2 } from "~/api.ts";

import { Defect } from "./defect.ts";

export class ModuleDefect extends Defect implements ModuleDefect_v2 {
	mod;

	constructor({ rule, mod, description = "" }: {
		rule: string;
		mod: Module_v2;
		description?: string;
	}) {
		super({ rule, description });

		this.mod = mod;
	}
}
