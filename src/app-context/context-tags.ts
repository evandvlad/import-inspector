import { Dict } from "~/lib/dict.ts";
import type { AppContextTags, Dict as IDict, Mod } from "~/api.d.ts";

import { cache } from "./tag-based-cache.ts";

export class ContextTags implements AppContextTags {
	#modDict;

	constructor({ modDict }: { modDict: IDict<Mod> }) {
		this.#modDict = modDict;
	}

	get size() {
		return this.mods.size;
	}

	get names() {
		return this.mods.toKeys();
	}

	@cache("tags")
	get mods() {
		return this.#modDict.fold<IDict<Mod>>((acc, mod) => {
			mod.tags.names.forEach((tag) => {
				acc.getOrInsertComputed(tag, () => Dict.empty()).set(mod.path, mod);
			});

			return acc;
		});
	}

	has(name: string) {
		return this.mods.has(name);
	}
}
