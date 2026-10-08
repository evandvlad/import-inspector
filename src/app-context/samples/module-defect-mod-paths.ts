import type { ModuleDefectModPathsSample as IModuleDefectModPathsSample } from "~/api.ts";

import type { Modules } from "../modules.ts";

export class ModuleDefectModPathsSample implements IModuleDefectModPathsSample {
	modPaths;

	#defectsMap;

	constructor({ modules }: { modules: Modules }) {
		this.#defectsMap = new Map(
			Iterator.from(modules.getAll())
				.filter(({ defects }) => defects.length > 0)
				.map(({ path, defects }) => [path, defects]),
		);

		this.modPaths = this.#defectsMap.keys().toArray();
	}

	get(modPath: string) {
		return this.#defectsMap.get(modPath) ?? [];
	}
}
