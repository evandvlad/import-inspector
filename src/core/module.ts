import type { Module as IModule, ModuleDefect } from "~/api.ts";

import type { FilePathRec } from "./path-rec-provider/index.ts";
import type { Import } from "./import.ts";
import { getFileLang } from "./project-specifics.ts";

export class Module implements IModule {
	name;
	path;
	lang;
	links;
	frameSet;
	parentDirPath;
	packagePath;
	importMap;
	isPackageEntryPoint;
	tagSet = new Set<string>();
	defectMap = new Map<string, ModuleDefect>();

	constructor(
		{ filePathRec, packagePath, frames, imports, links, isPackageEntryPoint }: {
			filePathRec: FilePathRec;
			frames: string[];
			imports: Import[];
			links: string[];
			packagePath: string | null;
			isPackageEntryPoint: boolean;
		},
	) {
		this.links = links;
		this.path = filePathRec.path;
		this.name = filePathRec.baseName;
		this.lang = getFileLang(filePathRec.path);
		this.packagePath = packagePath;
		this.parentDirPath = filePathRec.parentPath;
		this.isPackageEntryPoint = isPackageEntryPoint;
		this.frameSet = new Set(frames);
		this.importMap = new Map(imports.map((imp) => [imp.id, imp]));
	}

	setTag(tag: string) {
		this.tagSet.add(tag);
	}

	removeTag(tag: string) {
		this.tagSet.delete(tag);
	}

	addDefect({ rule, description = "" }: { rule: string; description?: string }) {
		this.defectMap.set(rule, {
			rule,
			description,
			sourcePath: this.path,
		});
	}

	removeDefect(rule: string) {
		this.defectMap.delete(rule);
	}
}
