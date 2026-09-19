import type { ContextImportDefects, ImportDefect } from "~/api.ts";

import type { Imports } from "./imports.ts";
import type { Modules } from "./modules.ts";

export class ImportDefects implements ContextImportDefects {
	#imports;
	#modules;

	constructor({ imports, modules }: { imports: Imports; modules: Modules }) {
		this.#imports = imports;
		this.#modules = modules;
	}

	getAll() {
		return this.#imports.getAll().flatMap(({ defectMap }) => Array.from(defectMap.values()));
	}

	getAllAsRuleMap() {
		return this.#imports.getAll().reduce((acc, { defectMap }) => {
			defectMap.forEach((defect, rule) => {
				acc.getOrInsert(rule, []).push(defect);
			});

			return acc;
		}, new Map<string, ImportDefect[]>());
	}

	getAllAsModulePathMap() {
		return this.#imports.getAll().reduce((acc, { sourcePath, defectMap }) => {
			defectMap.forEach((defect) => {
				acc.getOrInsert(sourcePath, []).push(defect);
			});

			return acc;
		}, new Map<string, ImportDefect[]>());
	}

	getAllRules() {
		const all = this.#imports.getAll().flatMap(({ defectMap }) => Array.from(defectMap.keys()));
		return Array.from(new Set(all));
	}

	getByImportId(id: string) {
		const imp = this.#imports.get(id);
		return Array.from(imp.defectMap.values());
	}

	getByRule(rule: string) {
		return Iterator.from(this.#imports.getAll())
			.filter(({ defectMap }) => defectMap.has(rule))
			.map(({ defectMap }) => defectMap.get(rule)!)
			.toArray();
	}

	getModulesByRule(rule: string) {
		return Iterator.from(this.#imports.getAll())
			.filter(({ defectMap }) => defectMap.has(rule))
			.map(({ sourcePath }) => this.#modules.get(sourcePath))
			.toArray();
	}

	remove({ importId, rule }: { importId: string; rule: string }) {
		const imp = this.#imports.get(importId);
		imp.defectMap.delete(rule);
	}

	removeByRule(rule: string) {
		this.getByRule(rule).forEach(({ importId }) => {
			this.remove({ importId, rule });
		});
	}

	removeAll() {
		this.getAll().forEach(({ importId, rule }) => {
			this.remove({ importId, rule });
		});
	}
}
