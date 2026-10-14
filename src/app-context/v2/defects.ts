import { assert } from "~/lib/err.ts";
import { Dict } from "~/lib/dict.ts";
import type { DefRef } from "~/lib/ref.ts";
import type { Defects_v2, Import_v2, ImportDefect_v2, Module_v2, ModuleDefect_v2 } from "~/api.ts";

import { ImportDefect, ModuleDefect } from "./defect.ts";

abstract class Defects<T extends ImportDefect_v2 | ModuleDefect_v2> implements Defects_v2<T> {
	byRule;

	constructor() {
		this.byRule = Dict.empty<T>();
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
		assert(defect, `Can't get defect by rule '${rule}'.`);
		return defect;
	}

	find(rule: string): T | null {
		return this.byRule.getOrDefault(rule, null);
	}

	add(rule: string, description?: string) {
		const defect = this.createDefect(rule, description);
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

	protected abstract createDefect(rule: string, description?: string): T;
}

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

export class ImportDefects extends Defects<ImportDefect_v2> {
	#imp;
	#modRef;

	constructor({ imp, modRef }: { imp: Import_v2; modRef: DefRef<Module_v2> }) {
		super();

		this.#imp = imp;
		this.#modRef = modRef;
	}

	protected override createDefect(rule: string, description?: string) {
		return new ImportDefect({ rule, description, imp: this.#imp, mod: this.#modRef.value });
	}
}
