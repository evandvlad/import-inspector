import { Dict } from "~/lib/dict.ts";
import type { AppContextTags, Dict as IDict, Module } from "~/api.d.ts";

import { cache } from "./tag-based-cache.ts";

export class ContextTags implements AppContextTags {
	#modDict;

	constructor({ modDict }: { modDict: IDict<Module> }) {
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
		return this.#modDict.fold<IDict<Module>>((acc, mod) => {
			mod.tags.names.forEach((tag) => {
				acc.getOrInsertComputed(tag, () => Dict.empty()).set(mod.path, mod);
			});

			return acc;
		});
	}

	has(name: string) {
		return this.names.includes(name);
	}
}
