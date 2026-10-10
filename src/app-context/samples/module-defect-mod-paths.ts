import type { Dict, Module, ModuleDefectModPathsSample as IModuleDefectModPathsSample } from "~/api.ts";

export class ModuleDefectModPathsSample implements IModuleDefectModPathsSample {
	modPaths;

	#defectsMap;

	constructor({ modules }: { modules: Dict<Module> }) {
		this.#defectsMap = new Map(
			Iterator.from(modules.toArray())
				.filter(({ defects }) => defects.size > 0)
				.map(({ path, defects }) => [path, defects.toArray()]),
		);

		this.modPaths = this.#defectsMap.keys().toArray();
	}

	get(modPath: string) {
		return this.#defectsMap.get(modPath) ?? [];
	}
}
