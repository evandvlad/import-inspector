import { Dict } from "~/lib/dict.ts";
import type { AppContextDefects, Dict as IDict, Module, ModuleDefect, ReadonlyDict } from "~/api.ts";

import { ContextDefects } from "./context-defects.ts";

export class ContextModuleDefects extends ContextDefects<ModuleDefect> implements AppContextDefects<ModuleDefect> {
	#modDict;

	constructor({ modDict }: { modDict: IDict<Module> }) {
		super();

		this.#modDict = modDict;
	}

	protected override createDictById() {
		return this.#modDict.fold<ModuleDefect>((acc, mod) => acc.merge(mod.defects.byRule.mapK(({ id }) => id)));
	}

	protected override createDictByPath() {
		return this.#modDict.fold<ReadonlyDict<ModuleDefect>>((acc, mod) => {
			if (mod.defects.size > 0) {
				acc.set(mod.path, mod.defects.byRule);
			}

			return acc;
		});
	}

	protected override createDictByRule() {
		return this.#modDict.fold<ReadonlyDict<ModuleDefect>>((acc, mod) => {
			mod.defects.byRule.forEach((defect) => {
				const dict = acc.getOrInsertComputed(defect.rule, () => Dict.empty());
				(dict as IDict<ModuleDefect>).set(defect.mod.path, defect);
			});

			return acc;
		});
	}

	protected override removeDefect(defect: ModuleDefect) {
		defect.mod.defects.remove(defect.rule);
	}
}
