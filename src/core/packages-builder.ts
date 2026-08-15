import type { Package } from "~/api.ts";

import type { PathRecProvider } from "./path-rec-provider/index.ts";
import type { PackageFinder } from "./package-finder/index.ts";
import type { Module } from "./module.ts";

export function buildPackages(
	{ modules, pathRecProvider, packageFinder }: {
		modules: Module[];
		pathRecProvider: PathRecProvider;
		packageFinder: PackageFinder;
	},
): Package[] {
	const packagePaths = Object.groupBy(
		modules.filter(({ packagePath }) => Boolean(packagePath)),
		({ packagePath }) => packagePath!,
	);

	return Object.entries(packagePaths)
		.map(([path, modules]) => {
			const { name, parentPath } = pathRecProvider.getDirPathRec(path);

			return {
				name,
				path,
				parentDirPath: parentPath,
				modulePaths: modules!.map(({ path }) => path),
				subPackagePaths: packageFinder.findChildren(path),
				parentPackagePath: parentPath ? packageFinder.findCurrent(path) : null,
			};
		});
}
