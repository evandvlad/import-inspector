import { assertNever } from "~/lib/ts.ts";
import type { Json, Package as IPackage, ViewDataMode } from "~/api.ts";

export class Package implements IPackage {
	name;
	path;
	modulePaths;
	parentDirPath;
	subPackagePaths;
	parentPackagePath;

	hasParentPackage;

	constructor(
		{ name, path, parentDirPath, modulePaths, subPackagePaths, parentPackagePath }: {
			name: string;
			path: string;
			modulePaths: string[];
			subPackagePaths: string[];
			parentDirPath: string | null;
			parentPackagePath: string | null;
		},
	) {
		this.name = name;
		this.path = path;
		this.modulePaths = modulePaths;
		this.parentDirPath = parentDirPath;
		this.subPackagePaths = subPackagePaths;
		this.parentPackagePath = parentPackagePath;
		this.hasParentPackage = parentPackagePath !== null;
	}

	toViewData(mode: ViewDataMode = "brief"): Json {
		switch (mode) {
			case "minimal":
				return this.path;

			case "brief":
				return this.#toBriefViewData();

			case "verbose":
				return {
					...this.#toBriefViewData(),
					modulePaths: this.modulePaths,
				};

			default:
				assertNever(mode);
		}
	}

	#toBriefViewData() {
		return {
			path: this.path,
			parentPackagePath: this.parentPackagePath,
			subPackagePaths: this.subPackagePaths,
		};
	}
}
