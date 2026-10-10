import { Dict } from "~/lib/dict.ts";
import type { Module } from "~/api.ts";

import type { PathRecProvider } from "./path-rec-provider/index.ts";
import type { PackageFinder } from "./package-finder/index.ts";
import { Package } from "./package.ts";

export function buildPackages(
	{ modules, pathRecProvider, packageFinder }: {
		modules: Dict<Module>;
		pathRecProvider: PathRecProvider;
		packageFinder: PackageFinder;
	},
) {
	return modules
		.filter(({ isInPack }) => isInPack)
		.group(({ pack }) => pack!)
		.map(
			(modules, path) => {
				const { name, parentPath } = pathRecProvider.getDirPathRec(path);

				return new Package({
					name,
					path,
					modules: Dict.fromArray(modules, ({ path }) => path),
					children: packageFinder.findChildren(path),
					parent: parentPath ? packageFinder.findCurrent(path) : null,
				});
			},
		);
}
