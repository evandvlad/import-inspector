import type { Nullable } from "~/lib/ts.ts";
import type { Dict as IDict, Imp as IImp, Mod } from "~/api.d.ts";
import type { ImpRec, ImpResolutionData } from "~/values.ts";

import { ImpDefects } from "./imp-defects.ts";
import { cache } from "./tag-based-cache.ts";

export class Imp implements IImp {
	id;
	locator;
	location;
	isDynamic;

	#modPath;
	#posSpan;
	#resolution;
	#modDict;

	constructor(
		{ modPath, impRec, resolution, modDict }: {
			modPath: string;
			impRec: ImpRec;
			resolution: Nullable<ImpResolutionData>;
			modDict: IDict<Mod>;
		},
	) {
		this.id = crypto.randomUUID();
		this.locator = impRec.locator;
		this.isDynamic = impRec.isDynamic;
		this.location = resolution?.path ?? this.locator;

		this.#posSpan = impRec.posSpan;
		this.#modPath = modPath;
		this.#resolution = resolution;
		this.#modDict = modDict;
	}

	@cache()
	get defects() {
		return new ImpDefects({ imp: this as IImp, mod: this.sourceMod });
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
