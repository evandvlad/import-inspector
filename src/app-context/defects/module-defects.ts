import type { Module, ModuleDefect as IModuleDefect } from "~/api.ts";

import { ModuleDefect } from "../defect/index.ts";

import { Defects } from "./defects.ts";

export class ModuleDefects extends Defects<IModuleDefect> {
	#mod;

	constructor({ mod }: { mod: Module }) {
		super();

		this.#mod = mod;
	}

	protected override createDefect(rule: string, description?: string) {
		return new ModuleDefect({ rule, description, mod: this.#mod });
	}
}
