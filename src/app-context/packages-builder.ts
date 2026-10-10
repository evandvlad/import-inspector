import type { Dict } from "~/lib/dict.ts";

import type { PathRecProvider } from "./path-rec-provider/index.ts";
import type { PackageFinder } from "./package-finder/index.ts";
import type { Module } from "./module.ts";
import { Package } from "./package.ts";

export function buildPackages(
	{ modules, pathRecProvider, packageFinder }: {
		modules: Dict<Module>;
		pathRecProvider: PathRecProvider;
		packageFinder: PackageFinder;
	},
) {
	return modules
		.filter(({ isInPackage }) => isInPackage)
		.group(({ packagePath }) => packagePath!)
		.map(
			(modules, path) => {
				const { name, parentPath } = pathRecProvider.getDirPathRec(path);

				return new Package({
					name,
					path,
					parentDirPath: parentPath,
					modulePaths: modules.map(({ path }) => path),
					subPackagePaths: packageFinder.findChildren(path),
					parentPackagePath: parentPath ? packageFinder.findCurrent(path) : null,
				});
			},
		);
}
