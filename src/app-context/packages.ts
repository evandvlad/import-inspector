import { assert } from "~/lib/err.ts";
import type { Packages as IPackages } from "~/api.ts";
import { Dict } from "~/lib/dict.ts";

import type { Module } from "./module.ts";
import type { Package } from "./package.ts";

export class Packages implements IPackages {
	all;
	roots;

	#modules;

	constructor({ packages, modules }: { packages: Dict<Package>; modules: Dict<Module> }) {
		this.#modules = modules;

		this.all = packages;
		this.roots = this.all.filter(({ hasParentPackage }) => !hasParentPackage);
	}

	parent(path: string) {
		const { parentPackagePath } = this.all.get(path);
		assert(parentPackagePath, `Can't find parent package for path '${path}'.`);
		return this.all.get(parentPackagePath);
	}

	children(path: string) {
		const { subPackagePaths } = this.all.get(path);
		return Dict.fromEntries(subPackagePaths.map((subPath) => [subPath, this.all.get(subPath)]));
	}

	ancestry(path: string) {
		return Dict.fromArray(
			this.#ancestry(path).toArray(),
			({ path }) => path,
		);
	}

	modules(path: string) {
		return Dict.fromArray(
			this.all.get(path).modulePaths.map((modPath) => this.#modules.get(modPath)),
			({ path }) => path,
		);
	}

	*#ancestry(path: string) {
		let pack: Package | null = this.all.get(path);

		do {
			pack = pack.parentPackagePath ? this.all.getOrDefault(pack.parentPackagePath, null) : null;

			if (pack) {
				yield pack;
			}
		} while (pack);
	}
}
