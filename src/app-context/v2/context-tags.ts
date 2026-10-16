import { Dict } from "~/lib/dict.ts";
import type { AppContextTags_v2, Dict as IDict, Module_v2, PathableEntities_v2 } from "~/api.ts";

import { PathableEntities } from "./pathable-entities.ts";

export class ContextTags implements AppContextTags_v2 {
	#modDict;

	constructor({ modDict }: { modDict: IDict<Module_v2> }) {
		this.#modDict = modDict;
	}

	get total() {
		return this.modBy.size;
	}

	get names() {
		return this.modBy.toKeys();
	}

	get modBy() {
		return this.#modDict.fold<IDict<Module_v2>>((acc, mod) => {
			mod.tags.names.forEach((tag) => {
				acc.getOrInsert(tag, Dict.empty<Module_v2>()).set(mod.path, mod);
			});

			return acc;
		}).map<PathableEntities_v2<Module_v2>>((dict) => new PathableEntities({ dict }));
	}

	has(name: string) {
		return this.names.includes(name);
	}
}
