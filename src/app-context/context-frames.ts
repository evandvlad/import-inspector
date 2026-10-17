import { Dict } from "~/lib/dict.ts";
import type { AppContextFrames, Dict as IDict, Module, PathableEntities as IPathableEntities } from "~/api.ts";

import { PathableEntities } from "./pathable-entities.ts";

export class ContextFrames implements AppContextFrames {
	#modDict;

	constructor({ modDict }: { modDict: IDict<Module> }) {
		this.#modDict = modDict;
	}

	get size() {
		return this.modBy.size;
	}

	get names() {
		return this.modBy.toKeys();
	}

	get modBy() {
		return this.#modDict.fold<IDict<Module>>((acc, mod) => {
			mod.frames.names.forEach((frame) => {
				acc.getOrInsertComputed(frame, () => Dict.empty()).set(mod.path, mod);
			});

			return acc;
		}).map<IPathableEntities<Module>>((dict) => new PathableEntities({ dict }));
	}

	has(name: string) {
		return this.names.includes(name);
	}
}
