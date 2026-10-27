import type { Dict, LocalExp as ILocalExp, Mod } from "~/api.d.ts";
import type { ExpRec } from "~/values.ts";

import { ImpexValues } from "./impex-values.ts";
import { cache } from "./tag-based-cache.ts";

export class LocalExp implements ILocalExp {
	id;
	values;

	#modPath;
	#modDict;
	#posSpan;

	constructor({ modPath, expRec, modDict }: { modPath: string; expRec: ExpRec; modDict: Dict<Mod> }) {
		this.id = crypto.randomUUID();
		this.values = new ImpexValues({ values: expRec.rhValues });

		this.#modPath = modPath;
		this.#modDict = modDict;
		this.#posSpan = expRec.posSpan;
	}

	get sourceMod() {
		return this.#modDict.get(this.#modPath);
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
