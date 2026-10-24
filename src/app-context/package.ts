import { isNull } from "~/lib/vtype.ts";
import { Dict } from "~/lib/dict.ts";
import type { Nullable } from "~/lib/ts.ts";
import type { Dict as IDict, Module, Package as IPackage } from "~/api.d.ts";

import { cache } from "./tag-based-cache.ts";

export class Package implements IPackage {
	name;
	path;
	mods;
	shortPath;

	#packDict;
	#parentPath;
	#childPaths;

	constructor(
		{ name, path, shortPath, modDict, parentPath, childPaths, packDict }: {
			name: string;
			path: string;
			shortPath: string;
			modDict: IDict<Module>;
			parentPath: Nullable<string>;
			childPaths: string[];
			packDict: IDict<IPackage>;
		},
	) {
		this.name = name;
		this.path = path;
		this.shortPath = shortPath;
		this.mods = modDict;

		this.#packDict = packDict;
		this.#parentPath = parentPath;
		this.#childPaths = childPaths;
	}

	get parent() {
		return this.#parentPath ? this.#packDict.get(this.#parentPath) : null;
	}

	get hasParent() {
		return !isNull(this.parent);
	}

	@cache()
	get children() {
		return this.#packDict.pick(this.#childPaths);
	}

	@cache()
	get ancestry() {
		const dict = Dict.empty<IPackage>();

		let parPath = this.#parentPath;

		while (!isNull(parPath)) {
			const pack = this.#packDict.get(parPath);
			dict.set(parPath, pack);
			parPath = pack.parent?.path ?? null;
		}

		return dict;
	}
}
