import { Dict } from "~/lib/dict.ts";
import type { AppContextDefects, Dict as IDict, Mod, ModDefect } from "~/api.d.ts";

import { cache } from "./tag-based-cache.ts";

export class ContextModDefects implements AppContextDefects<ModDefect> {
	#modDict;

	constructor({ modDict }: { modDict: IDict<Mod> }) {
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

	@cache("mod-defects")
	get byId() {
		return this.#modDict.fold<ModDefect>((acc, mod) => acc.merge(mod.defects.byRule.mapK(({ id }) => id)));
	}

	@cache("mod-defects")
	get byRule() {
		return this.#modDict.fold<IDict<ModDefect>>((acc, mod) => {
			mod.defects.byRule.forEach((defect) => {
				acc.getOrInsertComputed(defect.rule, () => Dict.empty()).set(defect.mod.path, defect);
			});

			return acc;
		});
	}

	@cache("mod-defects")
	get byPath() {
		return this.#modDict.fold<IDict<ModDefect>>((acc, mod) => {
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
		const defects = this.byRule.getOrDefault<ModDefect[]>(rule, []);

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

	#removeDefect(defect: ModDefect) {
		defect.defects.remove(defect.rule);
	}
}
