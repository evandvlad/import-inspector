import { assert } from "~/lib/err.ts";
import { Dict } from "~/lib/dict.ts";
import type { DefRef } from "~/lib/ref.ts";
import type { Import_v2, ImportDefect_v2, ImportDefects_v2, Module_v2 } from "~/api.ts";

import { ImportDefect } from "./import-defect.ts";

export class ImportDefects implements ImportDefects_v2 {
	byRule;

	#imp;
	#modRef;

	constructor({ imp, modRef }: { imp: Import_v2; modRef: DefRef<Module_v2> }) {
		this.#imp = imp;
		this.#modRef = modRef;

		this.byRule = Dict.empty<ImportDefect_v2>();
	}

	get total() {
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
		assert(defect, `Can't get import defect for rule '${rule}'.`);
		return defect;
	}

	find(rule: string) {
		return this.byRule.getOrDefault(rule, null);
	}

	add(rule: string, description?: string) {
		const defect = new ImportDefect({ rule, description, imp: this.#imp, mod: this.#modRef.value });
		this.byRule.set(rule, defect);
		return this;
	}

	remove(rule: string) {
		this.byRule.remove(rule);
		return this;
	}

	removeAll() {
		this.byRule.clear();
		return this;
	}
}
