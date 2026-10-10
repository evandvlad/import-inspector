import type { ImportDefect, ImportDefectModPathsSample as IImportDefectModPathsSample, Imports } from "~/api.ts";

export class ImportDefectModPathsSample implements IImportDefectModPathsSample {
	modPaths;

	#defectsMap;

	constructor({ imports }: { imports: Imports }) {
		this.#defectsMap = imports.all.reduce((acc, { source, defects }) => {
			defects.forEach((defect) => {
				acc.getOrInsert(source, []).push(defect);
			});

			return acc;
		}, new Map<string, ImportDefect[]>());

		this.modPaths = this.#defectsMap.keys().toArray();
	}

	get(modPath: string) {
		return this.#defectsMap.get(modPath) ?? [];
	}
}
