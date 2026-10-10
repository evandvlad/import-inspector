import { assert } from "~/lib/err.ts";
import type { Dict as IDict, Package, Packages as IPackages } from "~/api.ts";
import { Dict } from "~/lib/dict.ts";

export class Packages implements IPackages {
	all;
	roots;

	constructor({ packages }: { packages: IDict<Package> }) {
		this.all = packages;
		this.roots = this.all.filter(({ hasParent }) => !hasParent);
	}

	parent(path: string) {
		const { parent } = this.all.get(path);
		assert(parent, `Can't find parent package for path '${path}'.`);
		return this.all.get(parent);
	}

	children(path: string) {
		const { children } = this.all.get(path);
		return Dict.fromEntries(children.map((childPath) => [childPath, this.all.get(childPath)]));
	}

	ancestry(path: string) {
		return Dict.fromArray(
			this.#ancestry(path).toArray(),
			({ path }) => path,
		);
	}

	*#ancestry(path: string) {
		let pack: Package | null = this.all.get(path);

		do {
			pack = pack.parent ? this.all.getOrDefault(pack.parent, null) : null;

			if (pack) {
				yield pack;
			}
		} while (pack);
	}
}
