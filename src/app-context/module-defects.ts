import { assert } from "~/lib/err.ts";
import { Dict } from "~/lib/dict.ts";
import type { Defects, Module, ModuleDefect as IModuleDefect } from "~/api.d.ts";

import { clear } from "./tag-based-cache.ts";
import { ModuleDefect } from "./module-defect.ts";

export class ModuleDefects implements Defects<IModuleDefect> {
	byRule;

	#mod;

	constructor({ mod }: { mod: Module }) {
		this.#mod = mod;
		this.byRule = Dict.empty<IModuleDefect>();
	}

	get size() {
		return this.byRule.size;
	}

	get rules() {
		return this.byRule.toKeys();
	}

	has(rule: string) {
		return this.byRule.has(rule);
	}

	get(rule: string) {
		const defect = this.find(rule);
		assert(defect, `Can't get module defect by rule '${rule}'.`);
		return defect;
	}

	find(rule: string) {
		return this.byRule.getOrDefault(rule, null);
	}

	@clear("module-defects")
	add(rule: string, description?: string) {
		const defect = new ModuleDefect({
			rule,
			description,
			mod: this.#mod,
			defects: this,
		});

		this.byRule.set(rule, defect);

		return this;
	}

	@clear("module-defects")
	remove(rule: string) {
		this.byRule.remove(rule);
		return this;
	}

	@clear("module-defects")
	removeAll() {
		this.byRule.clear();
		return this;
	}
}
