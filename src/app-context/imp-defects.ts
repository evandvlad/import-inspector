import { assert } from "~/lib/err.ts";
import { Dict } from "~/lib/dict.ts";
import type { Defects, Imp, ImpDefect as IImpDefect, Mod } from "~/api.d.ts";

import { clear } from "./tag-based-cache.ts";
import { ImpDefect } from "./imp-defect.ts";

export class ImpDefects implements Defects<IImpDefect> {
	byRule;

	#imp;
	#mod;

	constructor({ imp, mod }: { imp: Imp; mod: Mod }) {
		this.#imp = imp;
		this.#mod = mod;

		this.byRule = Dict.empty<IImpDefect>();
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
		assert(defect, `Can't get imp defect by rule '${rule}'.`);
		return defect;
	}

	find(rule: string) {
		return this.byRule.getOrDefault(rule, null);
	}

	@clear("imp-defects")
	add(rule: string, description?: string) {
		const defect = new ImpDefect({
			rule,
			description,
			imp: this.#imp,
			mod: this.#mod,
			defects: this,
		});

		this.byRule.set(rule, defect);

		return this;
	}

	@clear("imp-defects")
	remove(rule: string) {
		this.byRule.remove(rule);
		return this;
	}

	@clear("imp-defects")
	removeAll() {
		this.byRule.clear();
		return this;
	}
}
