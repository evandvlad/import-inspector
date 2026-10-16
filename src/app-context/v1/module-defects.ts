import type { Dict as IDict, Module_v1, ModuleDefect_v1, ModuleDefects_v1 } from "~/api.ts";

export class ModuleDefects implements ModuleDefects_v1 {
	#modules;

	constructor({ modules }: { modules: IDict<Module_v1> }) {
		this.#modules = modules;
	}

	get total() {
		return this.#modules.reduce((acc, { defects }) => acc + defects.size, 0);
	}

	get byRule() {
		return this.#modules.fold<ModuleDefect_v1[]>((acc, mod) => {
			mod.defects.forEach((defect) => {
				acc.getOrInsert(defect.rule, []).push(defect);
			});

			return acc;
		});
	}

	get bySource() {
		return this.#modules.fold<ModuleDefect_v1[]>((acc, mod) => {
			mod.defects.forEach((defect) => {
				acc.getOrInsert(defect.source, []).push(defect);
			});

			return acc;
		});
	}

	remove(path: string, rule: string) {
		const mod = this.#modules.get(path);
		mod.defects.remove(rule);
	}

	removeByRule(rule: string) {
		this.#modules.forEach((mod) => {
			mod.defects.remove(rule);
		});
	}

	removeAll() {
		this.#modules.forEach((mod) => {
			mod.defects.clear();
		});
	}
}
