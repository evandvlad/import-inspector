import type { AppContextDefects, Dict, Import, ImportDefect } from "~/api.ts";

import { ContextDefects } from "./context-defects.ts";

export class ContextImportDefects extends ContextDefects<ImportDefect> implements AppContextDefects<ImportDefect> {
	#impDict;

	constructor({ impDict }: { impDict: Dict<Import> }) {
		super();
		this.#impDict = impDict;
	}

	protected override createDictById() {
		return this.#impDict.fold<ImportDefect>((acc, imp) => acc.merge(imp.defects.byRule.mapK(({ id }) => id)));
	}

	protected override createDictByPath() {
		return this.#impDict.fold<ImportDefect[]>((acc, imp) => {
			if (imp.defects.total > 0) {
				acc.addOrReduce(imp.sourceMod.path, imp.defects.byRule.toArray(), (acc, value) => acc.concat(value));
			}

			return acc;
		});
	}

	protected override createDictByRule() {
		return this.#impDict.fold<ImportDefect[]>((acc, imp) => {
			imp.defects.byRule.forEach((defect) => {
				acc.getOrInsert(defect.rule, []).push(defect);
			});

			return acc;
		});
	}

	protected override removeDefect(defect: ImportDefect) {
		defect.imp.defects.remove(defect.rule);
	}
}
