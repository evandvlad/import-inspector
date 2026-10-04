import { Dict } from "~/lib/dict.ts";
import type { AppContextDefects, Dict as IDict, Import, ImportDefect } from "~/api.ts";

import { cache } from "./tag-based-cache.ts";

export class ContextImportDefects implements AppContextDefects<ImportDefect> {
	#impDict;

	constructor({ impDict }: { impDict: IDict<Import> }) {
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

	@cache("import-defects")
	get byId() {
		return this.#impDict.fold<ImportDefect>((acc, imp) => acc.merge(imp.defects.byRule.mapK(({ id }) => id)));
	}

	@cache("import-defects")
	get byRule() {
		return this.#impDict.fold<IDict<ImportDefect>>((acc, imp) => {
			imp.defects.byRule.forEach((defect) => {
				const dict = acc.getOrInsertComputed(defect.rule, () => Dict.empty());
				dict.set(defect.id, defect);
			});

			return acc;
		});
	}

	@cache("import-defects")
	get byPath() {
		return this.#impDict.fold<IDict<ImportDefect>>((acc, imp) => {
			if (imp.defects.size > 0) {
				const dict = acc.getOrInsertComputed(imp.sourceMod.path, () => Dict.empty());
				dict.merge(imp.defects.byRule.mapK(({ id }) => id));
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
		const defects = this.byRule.getOrDefault<ImportDefect[]>(rule, []);

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

	#removeDefect(defect: ImportDefect) {
		defect.defects.remove(defect.rule);
	}
}
