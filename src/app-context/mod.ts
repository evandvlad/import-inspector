import { isNull } from "~/lib/vtype.ts";
import type { Nullable } from "~/lib/ts.ts";
import type { Dict, Exps, File, Imps, Mod as IMod, Pack } from "~/api.d.ts";
import { getFileLang } from "~/project-specifics.ts";

import { Tags } from "./tags.ts";
import { Frames } from "./frames.ts";
import { ModDefects } from "./mod-defects.ts";
import { cache } from "./tag-based-cache.ts";

export class Mod implements IMod {
	name;
	path;
	lang;
	tags;
	file;
	imps;
	exps;
	frames;
	shortPath;
	isPackEntry;
	defects: ModDefects;

	#packPath;
	#linkPaths;
	#modDict;
	#packDict;

	constructor(
		{ name, path, shortPath, packPath, imps, exps, linkPaths, file, isPackEntry, modDict, packDict }: {
			name: string;
			path: string;
			shortPath: string;
			imps: Imps;
			exps: Exps;
			linkPaths: string[];
			file: File;
			packPath: Nullable<string>;
			isPackEntry: boolean;
			modDict: Dict<IMod>;
			packDict: Dict<Pack>;
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
		this.defects = new ModDefects({ mod: this });
		this.imps = imps;
		this.exps = exps;

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
