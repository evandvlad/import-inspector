import { isNull } from "~/lib/vtype.ts";
import { DefRefCached } from "~/lib/ref.ts";
import type { Dict, File, Imports_v2, Module_v2, Package_v2 } from "~/api.ts";
import { getFileLang } from "~/project-specifics.ts";

import type { FilePathRec } from "../path-rec-provider/index.ts";

import { ModuleTrait } from "./module-trait.ts";
import { PathableEntities } from "./pathable-entities.ts";
import { ModuleDefects } from "./defects.ts";

export class Module implements Module_v2 {
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

	#packRef;
	#linksRef;

	constructor(
		{ filePathRec, packPath, imps, linkPaths, file, isPackEntry, modDict, packDict }: {
			filePathRec: FilePathRec;
			imps: Imports_v2;
			linkPaths: string[];
			file: File;
			packPath: string | null;
			isPackEntry: boolean;
			modDict: Dict<Module_v2>;
			packDict: Dict<Package_v2>;
		},
	) {
		this.name = filePathRec.baseName;
		this.path = filePathRec.path;
		this.file = file;
		this.shortPath = filePathRec.shortPath;
		this.lang = getFileLang(this.path);
		this.isPackEntry = isPackEntry;
		this.frames = new ModuleTrait();
		this.tags = new ModuleTrait();
		this.defects = new ModuleDefects({ mod: this });
		this.imps = imps;

		this.#packRef = new DefRefCached(() => packPath ? packDict.get(packPath) : null);
		this.#linksRef = new DefRefCached(() => new PathableEntities({ dict: modDict.pick(linkPaths) }));
	}

	get pack() {
		return this.#packRef.value;
	}

	get isInPack() {
		return !isNull(this.pack);
	}

	get links() {
		return this.#linksRef.value;
	}
}
