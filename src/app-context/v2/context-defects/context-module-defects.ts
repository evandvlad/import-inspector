import type { AppContextDefects_v2, Dict, Module_v2, ModuleDefect_v2 } from "~/api.ts";

import { ContextDefects } from "./context-defects.ts";

export class ContextModuleDefects extends ContextDefects<ModuleDefect_v2>
	implements AppContextDefects_v2<ModuleDefect_v2> {
	#modDict;

	constructor({ modDict }: { modDict: Dict<Module_v2> }) {
		super();
		this.#modDict = modDict;
	}

	protected override createDictById() {
		return this.#modDict.fold<ModuleDefect_v2>((acc, mod) => acc.merge(mod.defects.byRule.mapK(({ id }) => id)));
	}

	protected override createDictByPath() {
		return this.#modDict.fold<ModuleDefect_v2[]>((acc, mod) => {
			if (mod.defects.total > 0) {
				acc.set(mod.path, mod.defects.byRule.toArray());
			}

			return acc;
		});
	}

	protected override createDictByRule() {
		return this.#modDict.fold<ModuleDefect_v2[]>((acc, mod) => {
			mod.defects.byRule.forEach((defect) => {
				acc.getOrInsert(defect.rule, []).push(defect);
			});

			return acc;
		});
	}

	protected override removeDefect(defect: ModuleDefect_v2) {
		defect.mod.defects.remove(defect.rule);
	}
}
