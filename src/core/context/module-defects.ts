import type { ContextModuleDefects, ModuleDefect } from "~/api.ts";

import type { Modules } from "./modules.ts";

export class ModuleDefects implements ContextModuleDefects {
	#modules;

	constructor({ modules }: { modules: Modules }) {
		this.#modules = modules;
	}

	getAll() {
		return this.#modules.getAll().flatMap(({ defectMap }) => Array.from(defectMap.values()));
	}

	getAllAsPathMap() {
		return new Map(
			Iterator.from(this.#modules.getAll())
				.filter(({ defectMap }) => defectMap.size > 0)
				.map(({ path, defectMap }) => [path, defectMap.values().toArray()] as const),
		);
	}

	getAllAsRuleMap() {
		return this.#modules.getAll().reduce((acc, { defectMap }) => {
			defectMap.forEach((defect, rule) => {
				acc.getOrInsert(rule, []).push(defect);
			});

			return acc;
		}, new Map<string, ModuleDefect[]>());
	}

	getAllRules() {
		const all = this.#modules.getAll().flatMap(({ defectMap }) => Array.from(defectMap.keys()));
		return Array.from(new Set(all));
	}

	getByRule(rule: string) {
		return Iterator.from(this.#modules.getAll())
			.filter(({ defectMap }) => defectMap.has(rule))
			.map(({ defectMap }) => defectMap.get(rule)!)
			.toArray();
	}

	remove({ path, rule }: { path: string; rule: string }) {
		const module = this.#modules.get(path);
		module.defectMap.delete(rule);
	}

	removeByRule(rule: string) {
		this.getByRule(rule).forEach(({ sourcePath }) => {
			this.remove({ path: sourcePath, rule });
		});
	}

	removeAll() {
		this.getAll().forEach(({ sourcePath, rule }) => {
			this.remove({ path: sourcePath, rule });
		});
	}
}
