import { Dict } from "~/lib/dict.ts";
import type { AppContextDefects, Dict as IDict, Module, ModuleDefect } from "~/api.ts";

import { cache } from "./tag-based-cache.ts";

export class ContextModuleDefects implements AppContextDefects<ModuleDefect> {
	#modDict;

	constructor({ modDict }: { modDict: IDict<Module> }) {
		this.#modDict = modDict;
	}

	get size() {
		return this.byId.size;
	}

	get ids() {
		return this.byId.toKeys();
	}

	get paths() {
		return this.byPath.toKeys();
	}

	get rules() {
		return this.byRule.toKeys();
	}

	@cache("module-defects")
	get byId() {
		return this.#modDict.fold<ModuleDefect>((acc, mod) => acc.merge(mod.defects.byRule.mapK(({ id }) => id)));
	}

	@cache("module-defects")
	get byRule() {
		return this.#modDict.fold<IDict<ModuleDefect>>((acc, mod) => {
			mod.defects.byRule.forEach((defect) => {
				const dict = acc.getOrInsertComputed(defect.rule, () => Dict.empty());
				dict.set(defect.mod.path, defect);
			});

			return acc;
		});
	}

	@cache("module-defects")
	get byPath() {
		return this.#modDict.fold<IDict<ModuleDefect>>((acc, mod) => {
			if (mod.defects.size > 0) {
				acc.set(mod.path, mod.defects.byRule);
			}

			return acc;
		});
	}

	removeById(id: string) {
		const defect = this.byId.getOrDefault(id, null);

		if (defect) {
			this.#removeDefect(defect);
		}

		return this;
	}

	removeByRule(rule: string) {
		const defects = this.byRule.getOrDefault<ModuleDefect[]>(rule, []);

		defects.forEach((defect) => {
			this.#removeDefect(defect);
		});

		return this;
	}

	removeAll() {
		this.byId.forEach((defect) => {
			this.#removeDefect(defect);
		});

		return this;
	}

	#removeDefect(defect: ModuleDefect) {
		defect.defects.remove(defect.rule);
	}
}
