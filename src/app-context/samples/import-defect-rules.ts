import type { ImportDefectRulesSample as IImportDefectRulesSample } from "~/api.ts";

import type { Imports } from "../imports.ts";
import type { ImportDefect } from "../import-defect.ts";

export class ImportDefectRulesSample implements IImportDefectRulesSample {
	rules;

	#defectsMap;

	constructor({ imports }: { imports: Imports }) {
		this.#defectsMap = imports.all.reduce((acc, { defects }) => {
			defects.forEach((defect) => {
				acc.getOrInsert(defect.rule, []).push(defect);
			});

			return acc;
		}, new Map<string, ImportDefect[]>());

		this.rules = this.#defectsMap.keys().toArray();
	}

	get(rule: string) {
		return this.#defectsMap.get(rule) ?? [];
	}

	getModPaths(rule: string) {
		return Array.from(new Set(this.get(rule).map(({ sourcePath }) => sourcePath)));
	}
}
