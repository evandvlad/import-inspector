import type { ContextModuleDefects } from "~/api.ts";

import type { Modules } from "./modules.ts";

export class ModuleDefects implements ContextModuleDefects {
	#modules;

	constructor({ modules }: { modules: Modules }) {
		this.#modules = modules;
	}

	getAll() {
		return this.#modules.all.flatMap(({ defectMap }) => Array.from(defectMap.values()));
	}

	getAllRules() {
		const all = this.#modules.all.flatMap(({ defectMap }) => Array.from(defectMap.keys()));
		return Array.from(new Set(all));
	}

	getByRule(rule: string) {
		return Iterator.from(this.#modules.all)
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
