import { assertNever } from "~/lib/ts.ts";
import { assert } from "~/lib/err.ts";
import type { FileContent, Json, Module as IModule, ViewDataMode } from "~/api.ts";

import type { FilePathRec } from "./path-rec-provider/index.ts";
import type { Import } from "./import.ts";
import { getFileLang } from "./project-specifics.ts";
import { ModuleDefect } from "./module-defect.ts";

export class Module implements IModule {
	name;
	path;
	lang;
	links;
	imports;
	frames;
	fileContent;
	packagePath;
	parentDirPath;
	isPackageEntryPoint;
	tags: string[];
	defects: ModuleDefect[];

	isInPackage;

	constructor(
		{ filePathRec, packagePath, frames, imports, links, fileContent, isPackageEntryPoint }: {
			filePathRec: FilePathRec;
			frames: string[];
			imports: Import[];
			links: string[];
			fileContent: FileContent;
			packagePath: string | null;
			isPackageEntryPoint: boolean;
		},
	) {
		this.links = links;
		this.path = filePathRec.path;
		this.fileContent = fileContent;
		this.packagePath = packagePath;
		this.name = filePathRec.baseName;
		this.lang = getFileLang(filePathRec.path);
		this.parentDirPath = filePathRec.parentPath;
		this.isPackageEntryPoint = isPackageEntryPoint;
		this.frames = frames;
		this.tags = [];
		this.defects = [];
		this.imports = imports;
		this.isInPackage = this.packagePath !== null;
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

	addDefect({ rule, description }: { rule: string; description?: string }) {
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

	toViewData(mode: ViewDataMode = "brief"): Json {
		switch (mode) {
			case "minimal":
				return this.path;

			case "brief":
				return this.#toBriefViewData();

			case "verbose": {
				return {
					...this.#toBriefViewData(),
					links: this.links,
					tags: this.tags,
					frames: this.frames,
					imports: this.imports.map((imp) => imp.toViewData("verbose")),
					defects: this.defects.map((defect) => defect.toViewData("verbose")),
					content: this.fileContent.toViewData("verbose"),
				};
			}

			default:
				assertNever(mode);
		}
	}

	#toBriefViewData() {
		return {
			path: this.path,
			packagePath: this.packagePath,
			imports: this.imports.length,
			links: this.links.length,
			tags: this.tags.length,
			frames: this.frames.length,
			defects: this.defects.length,
		};
	}
}
