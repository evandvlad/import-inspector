import { isNull } from "~/lib/vtype.ts";
import type { Dict, File, Imports, Module as IModule, Package } from "~/api.d.ts";
import { getFileLang } from "~/project-specifics.ts";

import { Tags } from "./tags.ts";
import { Frames } from "./frames.ts";
import { ModuleDefects } from "./module-defects.ts";
import { cache } from "./tag-based-cache.ts";

export class Module implements IModule {
	name;
	path;
	lang;
	tags;
	file;
	imps;
	frames;
	shortPath;
	isPackEntry;
	defects: ModuleDefects;

	#packPath;
	#linkPaths;
	#modDict;
	#packDict;

	constructor(
		{ name, path, shortPath, packPath, imps, linkPaths, file, isPackEntry, modDict, packDict }: {
			name: string;
			path: string;
			shortPath: string;
			imps: Imports;
			linkPaths: string[];
			file: File;
			packPath: string | null;
			isPackEntry: boolean;
			modDict: Dict<IModule>;
			packDict: Dict<Package>;
		},
	) {
		this.name = name;
		this.path = path;
		this.file = file;
		this.tags = new Tags();
		this.frames = new Frames();
		this.shortPath = shortPath;
		this.lang = getFileLang(this.path);
		this.isPackEntry = isPackEntry;
		this.defects = new ModuleDefects({ mod: this });
		this.imps = imps;

		this.#packPath = packPath;
		this.#linkPaths = linkPaths;
		this.#modDict = modDict;
		this.#packDict = packDict;
	}

	get pack() {
		return this.#packPath ? this.#packDict.get(this.#packPath) : null;
	}

	get isInPack() {
		return !isNull(this.pack);
	}

	@cache()
	get links() {
		return this.#modDict.pick(this.#linkPaths);
	}
}
