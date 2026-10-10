import { isNull } from "~/lib/vtype.ts";
import { Dict } from "~/lib/dict.ts";
import type { Dict as IDict, File, Import, Module as IModule } from "~/api.ts";
import { getFileLang } from "~/project-specifics.ts";

import type { FilePathRec } from "./path-rec-provider/index.ts";
import { ModuleDefect } from "./module-defect.ts";

export class Module implements IModule {
	name;
	path;
	lang;
	file;
	pack;
	links;
	imports;
	isPackEntry;
	frames: string[];
	tags: string[];
	defects: IDict<ModuleDefect>;

	isInPack;

	constructor(
		{ filePathRec, pack, imports, links, file, isPackEntry }: {
			filePathRec: FilePathRec;
			imports: IDict<Import>;
			links: string[];
			file: File;
			pack: string | null;
			isPackEntry: boolean;
		},
	) {
		this.links = links;
		this.path = filePathRec.path;
		this.file = file;
		this.pack = pack;
		this.name = filePathRec.baseName;
		this.lang = getFileLang(filePathRec.path);
		this.isPackEntry = isPackEntry;
		this.frames = [];
		this.tags = [];
		this.defects = new Dict();
		this.imports = imports;
		this.isInPack = !isNull(this.pack);
	}

	hasTag(tag: string) {
		return this.tags.includes(tag);
	}

	setTag(tag: string) {
		if (!this.hasTag(tag)) {
			this.tags.push(tag);
		}
	}

	removeTag(tag: string) {
		this.tags = this.tags.filter((value) => value !== tag);
	}

	hasFrame(frame: string) {
		return this.frames.includes(frame);
	}

	setFrame(frame: string) {
		if (!this.hasFrame(frame)) {
			this.frames.push(frame);
		}
	}

	removeFrame(frame: string) {
		this.frames = this.frames.filter((value) => value !== frame);
	}

	addDefect(rule: string, description?: string) {
		this.defects.set(
			rule,
			new ModuleDefect({
				rule,
				description,
				source: this.path,
			}),
		);
	}
}
