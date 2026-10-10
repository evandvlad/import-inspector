import type { Dict, Module, ModuleDefect, ModuleDefectRulesSample as IModuleDefectRulesSample } from "~/api.ts";

export class ModuleDefectRulesSample implements IModuleDefectRulesSample {
	rules;

	#defectsMap;

	constructor({ modules }: { modules: Dict<Module> }) {
		this.#defectsMap = modules.reduce((acc, { defects }) => {
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
