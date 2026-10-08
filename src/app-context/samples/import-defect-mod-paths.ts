import type { ImportDefectModPathsSample as IImportDefectModPathsSample } from "~/api.ts";

import type { Imports } from "../imports.ts";
import type { ImportDefect } from "../import-defect.ts";

export class ImportDefectModPathsSample implements IImportDefectModPathsSample {
	modPaths;

	#defectsMap;

	constructor({ imports }: { imports: Imports }) {
		this.#defectsMap = imports.getAll().reduce((acc, { sourcePath, defects }) => {
			defects.forEach((defect) => {
				acc.getOrInsert(sourcePath, []).push(defect);
			});

			return acc;
		}, new Map<string, ImportDefect[]>());

		this.modPaths = this.#defectsMap.keys().toArray();
	}

	get(modPath: string) {
		return this.#defectsMap.get(modPath) ?? [];
	}
}
