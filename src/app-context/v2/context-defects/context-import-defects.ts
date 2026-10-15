import type { AppContextDefects_v2, Dict, Import_v2, ImportDefect_v2 } from "~/api.ts";

import { ContextDefects } from "./context-defects.ts";

export class ContextImportDefects extends ContextDefects<ImportDefect_v2>
	implements AppContextDefects_v2<ImportDefect_v2> {
	#impDict;

	constructor({ impDict }: { impDict: Dict<Import_v2> }) {
		super();
		this.#impDict = impDict;
	}

	protected override createDictById() {
		return this.#impDict.fold<ImportDefect_v2>((acc, imp) => acc.merge(imp.defects.byRule.mapK(({ id }) => id)));
	}

	protected override createDictByPath() {
		return this.#impDict.fold<ImportDefect_v2[]>((acc, imp) => {
			if (imp.defects.total > 0) {
				acc.addOrReduce(imp.sourceMod.path, imp.defects.byRule.toArray(), (acc, value) => acc.concat(value));
			}

			return acc;
		});
	}

	protected override createDictByRule() {
		return this.#impDict.fold<ImportDefect_v2[]>((acc, imp) => {
			imp.defects.byRule.forEach((defect) => {
				acc.getOrInsert(defect.rule, []).push(defect);
			});

			return acc;
		});
	}

	protected override removeDefect(defect: ImportDefect_v2) {
		defect.imp.defects.remove(defect.rule);
	}
}
