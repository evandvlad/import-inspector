import { Dict } from "~/lib/dict.ts";
import type { AppContextDefects, Dict as IDict, Imp, ImpDefect } from "~/api.d.ts";

import { cache } from "./tag-based-cache.ts";

export class ContextImpDefects implements AppContextDefects<ImpDefect> {
	#impDict;

	constructor({ impDict }: { impDict: IDict<Imp> }) {
		this.#impDict = impDict;
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

	@cache("imp-defects")
	get byId() {
		return this.#impDict.fold<ImpDefect>((acc, imp) => acc.merge(imp.defects.byRule.mapK(({ id }) => id)));
	}

	@cache("imp-defects")
	get byRule() {
		return this.#impDict.fold<IDict<ImpDefect>>((acc, imp) => {
			imp.defects.byRule.forEach((defect) => {
				acc.getOrInsertComputed(defect.rule, () => Dict.empty()).set(defect.id, defect);
			});

			return acc;
		});
	}

	@cache("imp-defects")
	get byPath() {
		return this.#impDict.fold<IDict<ImpDefect>>((acc, imp) => {
			if (imp.defects.size > 0) {
				acc.getOrInsertComputed(imp.sourceMod.path, () => Dict.empty()).merge(
					imp.defects.byRule.mapK(({ id }) => id),
				);
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
		const defects = this.byRule.getOrDefault<ImpDefect[]>(rule, []);

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

	#removeDefect(defect: ImpDefect) {
		defect.defects.remove(defect.rule);
	}
}
