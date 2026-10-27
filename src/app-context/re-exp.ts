import type { Nullable } from "~/lib/ts.ts";
import type { Dict, Mod, ReExp as IReExp } from "~/api.d.ts";
import type { ImpResolutionData, ReExpRec } from "~/values.ts";

import { ImpexValues } from "./impex-values.ts";
import { cache } from "./tag-based-cache.ts";

export class ReExp implements IReExp {
	id;
	values;
	locator;
	location;

	#modPath;
	#modDict;
	#posSpan;
	#resolution;

	constructor(
		{ modPath, reExpRec, resolution, modDict }: {
			modPath: string;
			reExpRec: ReExpRec;
			resolution: Nullable<ImpResolutionData>;
			modDict: Dict<Mod>;
		},
	) {
		this.id = crypto.randomUUID();
		this.values = new ImpexValues({ values: reExpRec.rhValues });
		this.locator = reExpRec.locator;
		this.location = resolution?.path ?? this.locator;

		this.#modPath = modPath;
		this.#modDict = modDict;
		this.#resolution = resolution;
		this.#posSpan = reExpRec.posSpan;
	}

	get sourceMod() {
		return this.#modDict.get(this.#modPath);
	}

	get importedMod() {
		return this.resolution?.mod ?? null;
	}

	@cache()
	get resolution() {
		if (!this.#resolution) {
			return null;
		}

		const { path, isExternal, isRelative } = this.#resolution;

		return {
			isExternal,
			isRelative,
			mod: path ? this.#modDict.get(path) : null,
		};
	}

	@cache()
	get fileLineRange() {
		const { file } = this.sourceMod;
		return file.getLineRange(this.#posSpan);
	}

	@cache()
	get fileEntries() {
		const { file } = this.sourceMod;
		return file.getEntriesBySpan(this.#posSpan);
	}
}
