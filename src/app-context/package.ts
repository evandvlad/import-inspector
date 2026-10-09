import { isNull } from "~/lib/vtype.ts";
import type { Package as IPackage } from "~/api.ts";

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
		this.hasParentPackage = !isNull(parentPackagePath);
	}
}
