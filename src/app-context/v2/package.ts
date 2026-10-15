import { isNull } from "~/lib/vtype.ts";
import { DefRefCached } from "~/lib/ref.ts";
import { Dict } from "~/lib/dict.ts";
import type { Dict as IDict, Module_v2, Package_v2, PathableEntities_v2 } from "~/api.ts";

import type { DirPathRec } from "../path-rec-provider/index.ts";

import { PathableEntities } from "./pathable-entities.ts";

export class Package implements Package_v2 {
	name;
	path;
	mods;
	shortPath;

	#parentRef;
	#childrenRef;
	#ancestryRef;

	constructor(
		{ dirPathRec, mods, childPaths, packDict }: {
			dirPathRec: DirPathRec;
			mods: PathableEntities_v2<Module_v2>;
			childPaths: string[];
			packDict: IDict<Package_v2>;
		},
	) {
		this.mods = mods;
		this.name = dirPathRec.name;
		this.path = dirPathRec.path;
		this.shortPath = dirPathRec.shortPath;

		const { parentPath } = dirPathRec;

		this.#parentRef = new DefRefCached(() => parentPath ? packDict.get(parentPath) : null);
		this.#childrenRef = new DefRefCached(() => new PathableEntities({ dict: packDict.pick(childPaths) }));

		this.#ancestryRef = new DefRefCached(() => {
			const dict = Dict.empty<Package_v2>();

			let parPath = parentPath;

			while (!isNull(parPath)) {
				const pack = packDict.get(parPath);
				dict.set(parPath, pack);
				parPath = pack.parent?.path ?? null;
			}

			return new PathableEntities({ dict });
		});
	}

	get parent() {
		return this.#parentRef.value;
	}

	get hasParent() {
		return !isNull(this.parent);
	}

	get children() {
		return this.#childrenRef.value;
	}

	get ancestry() {
		return this.#ancestryRef.value;
	}
}
