import { assert } from "~/lib/err.ts";
import { isNull } from "~/lib/vtype.ts";
import type { File, Module as IModule } from "~/api.ts";
import { getFileLang } from "~/project-specifics.ts";

import type { FilePathRec } from "./path-rec-provider/index.ts";
import type { Import } from "./import.ts";
import { ModuleDefect } from "./module-defect.ts";

export class Module implements IModule {
	name;
	path;
	lang;
	links;
	imports;
	file;
	packagePath;
	isPackageEntryPoint;
	frames: string[];
	tags: string[];
	defects: ModuleDefect[];

	isInPackage;

	constructor(
		{ filePathRec, packagePath, imports, links, file, isPackageEntryPoint }: {
			filePathRec: FilePathRec;
			imports: Import[];
			links: string[];
			file: File;
			packagePath: string | null;
			isPackageEntryPoint: boolean;
		},
	) {
		this.links = links;
		this.path = filePathRec.path;
		this.file = file;
		this.packagePath = packagePath;
		this.name = filePathRec.baseName;
		this.lang = getFileLang(filePathRec.path);
		this.isPackageEntryPoint = isPackageEntryPoint;
		this.frames = [];
		this.tags = [];
		this.defects = [];
		this.imports = imports;
		this.isInPackage = !isNull(this.packagePath);
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

	hasDefect(rule: string) {
		return this.defects.some((defect) => defect.rule === rule);
	}

	findDefect(rule: string) {
		return this.defects.find((defect) => defect.rule === rule) ?? null;
	}

	getDefect(rule: string) {
		const defect = this.findDefect(rule);
		assert(defect, `Can't find module defect for rule '${rule}'.`);
		return defect;
	}

	addDefect(rule: string, description?: string) {
		if (this.hasDefect(rule)) {
			return;
		}

		this.defects.push(
			new ModuleDefect({
				rule,
				description,
				sourcePath: this.path,
			}),
		);
	}

	removeDefect(rule: string) {
		this.defects = this.defects.filter((defect) => defect.rule !== rule);
	}
}
