import type { Module_v2, ModuleDefect_v2 } from "~/api.ts";

import { ModuleDefect } from "../defect/index.ts";

import { Defects } from "./defects.ts";

export class ModuleDefects extends Defects<ModuleDefect_v2> {
	#mod;

	constructor({ mod }: { mod: Module_v2 }) {
		super();

		this.#mod = mod;
	}

	protected override createDefect(rule: string, description?: string) {
		return new ModuleDefect({ rule, description, mod: this.#mod });
	}
}
