import { Dict } from "~/lib/dict.ts";
import type { AppContextDefects, Dict as IDict, Import, ImportDefect, ReadonlyDict } from "~/api.ts";

import { ContextDefects } from "./context-defects.ts";

export class ContextImportDefects extends ContextDefects<ImportDefect> implements AppContextDefects<ImportDefect> {
	#impDict;

	constructor({ impDict }: { impDict: IDict<Import> }) {
		super();

		this.#impDict = impDict;
	}

	protected override createDictById() {
		return this.#impDict.fold<ImportDefect>((acc, imp) => acc.merge(imp.defects.byRule.mapK(({ id }) => id)));
	}

	protected override createDictByPath() {
		return this.#impDict.fold<ReadonlyDict<ImportDefect>>((acc, imp) => {
			if (imp.defects.size > 0) {
				const dict = acc.getOrInsertComputed(imp.sourceMod.path, () => Dict.empty());
				(dict as IDict<ImportDefect>).merge(imp.defects.byRule.mapK(({ id }) => id));
			}

			return acc;
		});
	}

	protected override createDictByRule() {
		return this.#impDict.fold<ReadonlyDict<ImportDefect>>((acc, imp) => {
			imp.defects.byRule.forEach((defect) => {
				const dict = acc.getOrInsertComputed(defect.rule, () => Dict.empty());
				(dict as IDict<ImportDefect>).set(defect.id, defect);
			});

			return acc;
		});
	}

	protected override removeDefect(defect: ImportDefect) {
		defect.imp.defects.remove(defect.rule);
	}
}
