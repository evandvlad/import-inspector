import { DefRefCached } from "~/lib/ref.ts";
import type { Dict as IDict, Import_v2, Module_v2 } from "~/api.ts";
import type { ImportRec, ImportResolution } from "~/values.ts";

import { ImportDefects } from "./import-defects.ts";

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
		{ modulePath, importRec, resolution, modulesDict }: {
			modulePath: string;
			importRec: ImportRec;
			resolution: ImportResolution | null;
			modulesDict: IDict<Module_v2>;
		},
	) {
		this.id = crypto.randomUUID() as string;
		this.locator = importRec.locator;
		this.isDynamic = importRec.isDynamic;
		this.location = resolution?.path ?? this.locator;

		this.#posSpan = importRec.posSpan;

		this.#sourceModRef = new DefRefCached(() => modulesDict.get(modulePath));

		this.#resolutionRef = new DefRefCached(() =>
			resolution
				? {
					isExternal: resolution.isExternal,
					isRelative: resolution.isRelative,
					mod: resolution.path ? modulesDict.get(resolution.path) : null,
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
