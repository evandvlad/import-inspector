import type { ModuleDefects as IModuleDefects } from "~/api.ts";

import type { ModuleDefect } from "./module-defect.ts";
import type { Modules } from "./modules.ts";
import { ModuleDefectRulesSample } from "./samples/module-defect-rules.ts";
import { ModuleDefectModPathsSample } from "./samples/module-defect-mod-paths.ts";

export class ModuleDefects implements IModuleDefects {
	#modules;

	constructor({ modules }: { modules: Modules }) {
		this.#modules = modules;
	}

	getAll() {
		return this.#modules.getAll().flatMap(({ defects }) => defects);
	}

	getAllRules() {
		const all = this.#modules.getAll().flatMap(({ defects }) => defects.map(({ rule }) => rule));
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
		mod.removeDefect(rule);
	}

	removeByRule(rule: string) {
		Iterator.from(this.#modules.getAll())
			.map((mod) => mod.findDefect(rule))
			.filter((defect): defect is ModuleDefect => Boolean(defect))
			.forEach(({ sourcePath }) => {
				this.remove(sourcePath, rule);
			});
	}

	removeAll() {
		this.getAll().forEach(({ sourcePath, rule }) => {
			this.remove(sourcePath, rule);
		});
	}
}
