import type { Module, ModuleDefect as IModuleDefect } from "~/api.ts";

import { clear } from "../tag-based-cache.ts";
import { ModuleDefect } from "../defect/index.ts";

import { Defects } from "./defects.ts";

export class ModuleDefects extends Defects<IModuleDefect> {
	#mod;

	constructor({ mod }: { mod: Module }) {
		super();

		this.#mod = mod;
	}

	protected override createDefect(rule: string, description?: string) {
		return new ModuleDefect({ rule, description, mod: this.#mod, defects: this });
	}

	@clear("module-defects")
	override add(rule: string, description?: string) {
		super.add(rule, description);
		return this;
	}

	@clear("module-defects")
	override remove(rule: string) {
		super.remove(rule);
		return this;
	}

	@clear("module-defects")
	override removeAll() {
		super.removeAll();
		return this;
	}
}
