import { isNull } from "~/lib/vtype.ts";
import { DefRefCached } from "~/lib/ref.ts";
import type { Dict, File, Imports, Module as IModule, Package } from "~/api.ts";
import { getFileLang } from "~/project-specifics.ts";

import { ModuleTrait } from "./module-trait.ts";
import { PathableEntities } from "./pathable-entities.ts";
import { ModuleDefects } from "./defects/index.ts";

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

	#packRef;
	#linksRef;

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
		this.shortPath = shortPath;
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
