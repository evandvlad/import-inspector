import { assert } from "~/lib/err.ts";
import { Dict } from "~/lib/dict.ts";
import type { Defects, Import, ImportDefect as IImportDefect, Module } from "~/api.d.ts";

import { clear } from "./tag-based-cache.ts";
import { ImportDefect } from "./import-defect.ts";

export class ImportDefects implements Defects<IImportDefect> {
	byRule;

	#imp;
	#mod;

	constructor({ imp, mod }: { imp: Import; mod: Module }) {
		this.#imp = imp;
		this.#mod = mod;

		this.byRule = Dict.empty<IImportDefect>();
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
		assert(defect, `Can't get import defect by rule '${rule}'.`);
		return defect;
	}

	find(rule: string) {
		return this.byRule.getOrDefault(rule, null);
	}

	@clear("import-defects")
	add(rule: string, description?: string) {
		const defect = new ImportDefect({
			rule,
			description,
			imp: this.#imp,
			mod: this.#mod,
			defects: this,
		});

		this.byRule.set(rule, defect);

		return this;
	}

	@clear("import-defects")
	remove(rule: string) {
		this.byRule.remove(rule);
		return this;
	}

	@clear("import-defects")
	removeAll() {
		this.byRule.clear();
		return this;
	}
}
