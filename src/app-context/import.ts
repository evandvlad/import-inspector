import { DefRefCached } from "~/lib/ref.ts";
import type { Dict as IDict, Import as IImport, Module } from "~/api.ts";
import type { ImportRec, ImportResolution } from "~/values.ts";

import { ImportDefects } from "./defects/index.ts";

export class Import implements IImport {
	id;
	defects;
	locator;
	location;
	isDynamic;

	#posSpan;
	#sourceModRef;
	#resolutionRef;
	#importedModRef;

	constructor(
		{ modPath, importRec, resolution, modDict }: {
			modPath: string;
			importRec: ImportRec;
			resolution: ImportResolution | null;
			modDict: IDict<Module>;
		},
	) {
		this.id = crypto.randomUUID() as string;
		this.locator = importRec.locator;
		this.isDynamic = importRec.isDynamic;
		this.location = resolution?.path ?? this.locator;

		this.#posSpan = importRec.posSpan;

		this.#sourceModRef = new DefRefCached(() => modDict.get(modPath));

		this.#resolutionRef = new DefRefCached(() =>
			resolution
				? {
					isExternal: resolution.isExternal,
					isRelative: resolution.isRelative,
					mod: resolution.path ? modDict.get(resolution.path) : null,
				}
				: null
		);

		this.#importedModRef = new DefRefCached(() => this.resolution?.mod ?? null);

		this.defects = new ImportDefects({ imp: this as IImport, modRef: this.#sourceModRef });
	}

	get sourceMod() {
		return this.#sourceModRef.value;
	}

	get importedMod() {
		return this.#importedModRef.value;
	}

	get resolution() {
		return this.#resolutionRef.value;
	}

	get fileLineRange() {
		const { file } = this.#sourceModRef.value;
		return file.getLineRange(this.#posSpan);
	}

	get fileEntries() {
		const { file } = this.#sourceModRef.value;
		return file.getEntriesBySpan(this.#posSpan);
	}
}
