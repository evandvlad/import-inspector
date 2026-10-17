import { isNull } from "~/lib/vtype.ts";
import { DefRefCached } from "~/lib/ref.ts";
import { Dict } from "~/lib/dict.ts";
import type { Dict as IDict, Module, Package as IPackage } from "~/api.ts";

import { PathableEntities } from "./pathable-entities.ts";

export class Package implements IPackage {
	name;
	path;
	mods;
	shortPath;

	#parentRef;
	#childrenRef;
	#ancestryRef;

	constructor(
		{ name, path, shortPath, modDict, parentPath, childPaths, packDict }: {
			name: string;
			path: string;
			shortPath: string;
			modDict: IDict<Module>;
			parentPath: string | null;
			childPaths: string[];
			packDict: IDict<IPackage>;
		},
	) {
		this.name = name;
		this.path = path;
		this.shortPath = shortPath;
		this.mods = new PathableEntities({ dict: modDict });

		this.#parentRef = new DefRefCached(() => parentPath ? packDict.get(parentPath) : null);
		this.#childrenRef = new DefRefCached(() => new PathableEntities({ dict: packDict.pick(childPaths) }));

		this.#ancestryRef = new DefRefCached(() => {
			const dict = Dict.empty<IPackage>();

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
