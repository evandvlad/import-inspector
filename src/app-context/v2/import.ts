import { DefRefCached } from "~/lib/ref.ts";
import type { Dict as IDict, Import_v2, Module_v2, ImportDefects_v2 } from "~/api.ts";
import type { ImportRec, ImportResolution } from "~/values.ts";

import { ImportDefects } from "./import-defects.ts";

export class Import implements Import_v2 {
	id;
	posSpan;
	locator;
	location;
	isDynamic;
	resolution;
	defects: ImportDefects_v2;

	#sourceRef;
	#resolvedRef;

	constructor(
		{ sourceId, importRec, resolution, modulesDict }: {
			sourceId: string;
			importRec: ImportRec;
			resolution: ImportResolution | null;
			modulesDict: IDict<Module_v2>;
		},
	) {
		this.id = crypto.randomUUID() as string;
		this.locator = importRec.locator;
		this.posSpan = importRec.posSpan;
		this.isDynamic = importRec.isDynamic;
		this.resolution = resolution;
		this.location = resolution?.path ?? this.locator;

		this.#sourceRef = new DefRefCached(() => modulesDict.get(sourceId));
		this.#resolvedRef = new DefRefCached(() => resolution?.path ? modulesDict.get(resolution.path) : null);

		this.defects = new ImportDefects({ imp: this, modRef: this.#sourceRef });
	}

	get source() {
		return this.#sourceRef.value;
	}

	get resolved() {
		return this.#resolvedRef.value;
	}
}
