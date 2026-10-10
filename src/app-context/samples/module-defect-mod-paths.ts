import type { ModuleDefectModPathsSample as IModuleDefectModPathsSample } from "~/api.ts";
import type { Dict } from "~/lib/dict.ts";

import type { Module } from "../module.ts";

export class ModuleDefectModPathsSample implements IModuleDefectModPathsSample {
	modPaths;

	#defectsMap;

	constructor({ modules }: { modules: Dict<Module> }) {
		this.#defectsMap = new Map(
			Iterator.from(modules.toArray())
				.filter(({ defects }) => defects.length > 0)
				.map(({ path, defects }) => [path, defects]),
		);

		this.modPaths = this.#defectsMap.keys().toArray();
	}

	get(modPath: string) {
		return this.#defectsMap.get(modPath) ?? [];
	}
}
