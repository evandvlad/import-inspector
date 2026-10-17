import type { AppContextDefects, Dict, Module, ModuleDefect } from "~/api.ts";

import { ContextDefects } from "./context-defects.ts";

export class ContextModuleDefects extends ContextDefects<ModuleDefect> implements AppContextDefects<ModuleDefect> {
	#modDict;

	constructor({ modDict }: { modDict: Dict<Module> }) {
		super();
		this.#modDict = modDict;
	}

	protected override createDictById() {
		return this.#modDict.fold<ModuleDefect>((acc, mod) => acc.merge(mod.defects.byRule.mapK(({ id }) => id)));
	}

	protected override createDictByPath() {
		return this.#modDict.fold<ModuleDefect[]>((acc, mod) => {
			if (mod.defects.total > 0) {
				acc.set(mod.path, mod.defects.byRule.toArray());
			}

			return acc;
		});
	}

	protected override createDictByRule() {
		return this.#modDict.fold<ModuleDefect[]>((acc, mod) => {
			mod.defects.byRule.forEach((defect) => {
				acc.getOrInsert(defect.rule, []).push(defect);
			});

			return acc;
		});
	}

	protected override removeDefect(defect: ModuleDefect) {
		defect.mod.defects.remove(defect.rule);
	}
}
