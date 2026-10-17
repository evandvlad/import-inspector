import { Dict } from "~/lib/dict.ts";
import type { AppContextTags, Dict as IDict, Module, PathableEntities as IPathableEntities } from "~/api.ts";

import { PathableEntities } from "./pathable-entities.ts";

export class ContextTags implements AppContextTags {
	#modDict;

	constructor({ modDict }: { modDict: IDict<Module> }) {
		this.#modDict = modDict;
	}

	get total() {
		return this.modBy.size;
	}

	get names() {
		return this.modBy.toKeys();
	}

	get modBy() {
		return this.#modDict.fold<IDict<Module>>((acc, mod) => {
			mod.tags.names.forEach((tag) => {
				acc.getOrInsert(tag, Dict.empty<Module>()).set(mod.path, mod);
			});

			return acc;
		}).map<IPathableEntities<Module>>((dict) => new PathableEntities({ dict }));
	}

	has(name: string) {
		return this.names.includes(name);
	}
}
