import { assert } from "~/lib/err.ts";
import { Dict } from "~/lib/dict.ts";
import type { Defects, Mod, ModDefect as IModDefect } from "~/api.d.ts";

import { clear } from "./tag-based-cache.ts";
import { ModDefect } from "./mod-defect.ts";

export class ModDefects implements Defects<IModDefect> {
	byRule;

	#mod;

	constructor({ mod }: { mod: Mod }) {
		this.#mod = mod;
		this.byRule = Dict.empty<IModDefect>();
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
		assert(defect, `Can't get mod defect by rule '${rule}'.`);
		return defect;
	}

	find(rule: string) {
		return this.byRule.getOrDefault(rule, null);
	}

	@clear("mod-defects")
	add(rule: string, description?: string) {
		const defect = new ModDefect({
			rule,
			description,
			mod: this.#mod,
			defects: this,
		});

		this.byRule.set(rule, defect);

		return this;
	}

	@clear("mod-defects")
	remove(rule: string) {
		this.byRule.remove(rule);
		return this;
	}

	@clear("mod-defects")
	removeAll() {
		this.byRule.clear();
		return this;
	}
}
