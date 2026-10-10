import type { Module, ModuleDefect, ModuleDefects as IModuleDefects } from "~/api.ts";
import type { Dict } from "~/lib/dict.ts";

import { ModuleDefectRulesSample } from "./samples/module-defect-rules.ts";
import { ModuleDefectModPathsSample } from "./samples/module-defect-mod-paths.ts";

export class ModuleDefects implements IModuleDefects {
	#modules;

	constructor({ modules }: { modules: Dict<Module> }) {
		this.#modules = modules;
	}

	getAll() {
		return this.#modules.toArray().flatMap(({ defects }) => defects.toArray());
	}

	getAllRules() {
		const all = this.#modules.toArray().flatMap(({ defects }) => defects.map(({ rule }) => rule).toArray());
		return Array.from(new Set(all));
	}

	sampleRules() {
		return new ModuleDefectRulesSample({ modules: this.#modules });
	}

	sampleModPaths() {
		return new ModuleDefectModPathsSample({ modules: this.#modules });
	}

	remove(path: string, rule: string) {
		const mod = this.#modules.get(path);
		mod.defects.remove(rule);
	}

	removeByRule(rule: string) {
		Iterator.from(this.#modules.toArray())
			.map((mod) => mod.defects.getOrDefault(rule, null))
			.filter((defect): defect is ModuleDefect => Boolean(defect))
			.forEach(({ source }) => {
				this.remove(source, rule);
			});
	}

	removeAll() {
		this.getAll().forEach(({ source, rule }) => {
			this.remove(source, rule);
		});
	}
}
