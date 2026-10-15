import { DefRefCached } from "~/lib/ref.ts";
import type { Dict as IDict, Import_v2, Module_v2 } from "~/api.ts";
import type { ImportRec, ImportResolution } from "~/values.ts";

import { ImportDefects } from "./defects/index.ts";

export class Import implements Import_v2 {
	id;
	defects;
	locator;
	location;
	isDynamic;

	#posSpan;
	#sourceModRef;
	#resolutionRef;

	constructor(
		{ modPath, importRec, resolution, modDict }: {
			modPath: string;
			importRec: ImportRec;
			resolution: ImportResolution | null;
			modDict: IDict<Module_v2>;
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

		this.defects = new ImportDefects({ imp: this as Import_v2, modRef: this.#sourceModRef });
	}

	get sourceMod() {
		return this.#sourceModRef.value;
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
