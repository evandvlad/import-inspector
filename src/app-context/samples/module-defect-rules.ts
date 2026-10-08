import type { ModuleDefectRulesSample as IModuleDefectRulesSample } from "~/api.ts";

import type { Modules } from "../modules.ts";
import type { ModuleDefect } from "../module-defect.ts";

export class ModuleDefectRulesSample implements IModuleDefectRulesSample {
	rules;

	#defectsMap;

	constructor({ modules }: { modules: Modules }) {
		this.#defectsMap = modules.getAll().reduce((acc, { defects }) => {
			defects.forEach((defect) => {
				acc.getOrInsert(defect.rule, []).push(defect);
			});

			return acc;
		}, new Map<string, ModuleDefect[]>());

		this.rules = this.#defectsMap.keys().toArray();
	}

	get(rule: string) {
		return this.#defectsMap.get(rule) ?? [];
	}
}
