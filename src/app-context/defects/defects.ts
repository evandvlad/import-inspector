import { assert } from "~/lib/err.ts";
import { Dict } from "~/lib/dict.ts";
import type { Defects as IDefects, ImportDefect, ModuleDefect } from "~/api.ts";

export abstract class Defects<T extends ImportDefect | ModuleDefect> implements IDefects<T> {
	byRule;

	constructor() {
		this.byRule = Dict.empty<T>();
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
