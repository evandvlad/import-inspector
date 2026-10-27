import type { Dict, Exps as IExps, LocalExp, Mod, ReExp } from "~/api.d.ts";

import { ImpexValues } from "./impex-values.ts";

export class Exps implements IExps {
	size;
	localById;
	reExpById;

	allValues;
	localValues;
	reExpValues;

	#modPath;
	#modDict;

	constructor(
		{ modPath, reExpDict, localExpDict, modDict }: {
			modPath: string;
			modDict: Dict<Mod>;
			reExpDict: Dict<ReExp>;
			localExpDict: Dict<LocalExp>;
		},
	) {
		this.localById = localExpDict;
		this.reExpById = reExpDict;

		this.localValues = ImpexValues.concat(...localExpDict.map(({ values }) => values).toArray());
		this.reExpValues = ImpexValues.concat(...reExpDict.map(({ values }) => values).toArray());
		this.allValues = ImpexValues.concat(this.localValues, this.reExpValues);
		this.size = this.allValues.vals.length;

		this.#modPath = modPath;
		this.#modDict = modDict;
	}

	get sourceMod() {
		return this.#modDict.get(this.#modPath);
	}
}
