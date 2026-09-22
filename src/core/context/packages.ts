import { assert } from "~/lib/err.ts";
import type { ContextPackages, Package } from "~/api.ts";

export class Packages implements ContextPackages {
	#all;
	#roots;
	#packageMap;

	constructor({ packages }: { packages: Package[] }) {
		this.#all = packages;
		this.#roots = this.#all.filter(({ parentPackagePath }) => parentPackagePath === null);
		this.#packageMap = new Map(packages.map((pack) => [pack.path, pack]));
	}

	getAll() {
		return this.#all;
	}

	getRoots() {
		return this.#roots;
	}

	find(path: string) {
		return this.#packageMap.get(path) ?? null;
	}

	get(path: string) {
		const pack = this.find(path);
		assert(pack, `Can't find package for path '${path}'.`);
		return pack;
	}

	getSubs(path: string) {
		return this.get(path).subPackagePaths.map((subPath) => this.get(subPath));
	}

	findParent(path: string) {
		const { parentPackagePath } = this.get(path);
		return parentPackagePath ? this.get(parentPackagePath) : null;
	}

	getParent(path: string) {
		const { parentPackagePath } = this.get(path);
		assert(parentPackagePath, `Can't find parent package for path '${path}'.`);
		return this.get(parentPackagePath);
	}

	isInAncestryBranch({ sourcePath, testablePath }: { sourcePath: string; testablePath: string }) {
		return this.#getAncestryBranch(sourcePath).some(({ path }) => path === testablePath);
	}

	getAncestryBranch(path: string) {
		return Array.from(this.#getAncestryBranch(path));
	}

	*#getAncestryBranch(path: string) {
		let pack: Package | null = this.get(path);

		do {
			pack = pack.parentPackagePath ? this.find(pack.parentPackagePath) : null;

			if (pack) {
				yield pack;
			}
		} while (pack);
	}
}
