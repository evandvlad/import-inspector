import type { Dict as IDict, Import as IImport, Module } from "~/api.d.ts";
import type { ImportRec, ImportResolutionData } from "~/values.ts";

import { ImportDefects } from "./import-defects.ts";
import { cache } from "./tag-based-cache.ts";

export class Import implements IImport {
	id;
	locator;
	location;
	isDynamic;

	#modPath;
	#posSpan;
	#resolution;
	#modDict;

	constructor(
		{ modPath, importRec, resolution, modDict }: {
			modPath: string;
			importRec: ImportRec;
			resolution: ImportResolutionData | null;
			modDict: IDict<Module>;
		},
	) {
		this.id = crypto.randomUUID();
		this.locator = importRec.locator;
		this.isDynamic = importRec.isDynamic;
		this.location = resolution?.path ?? this.locator;

		this.#posSpan = importRec.posSpan;
		this.#modPath = modPath;
		this.#resolution = resolution;
		this.#modDict = modDict;
	}

	@cache()
	get defects() {
		return new ImportDefects({
			imp: this as IImport,
			mod: this.sourceMod,
		});
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
