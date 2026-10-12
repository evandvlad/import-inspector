import type { Module_v2, ModuleDefect_v2, ModuleDefects_v2 } from "~/api.ts";
import { Dict } from "~/lib/dict.ts";

import { ModuleDefect } from "./module-defect.ts";

export class ModuleDefects extends Dict<ModuleDefect_v2> implements ModuleDefects_v2 {
	#mod;

	constructor({ mod }: { mod: Module_v2 }) {
		super();

		this.#mod = mod;
	}

	get rules() {
		return this.toKeys();
	}

	add(rule: string, description?: string) {
		const defect = new ModuleDefect({ rule, description, mod: this.#mod });
		this.set(rule, defect);
		return this;
	}

	removeById(id: string) {
		const defect = this.find((defect) => defect.id === id);

		if (defect) {
			this.remove(defect.rule);
		}

		return this;
	}

	removeAll() {
		this.clear();
		return this;
	}
}
