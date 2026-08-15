import { assert } from "~/lib/err.ts";
import type { ContextPackages, Package } from "~/api.ts";

export class Packages implements ContextPackages {
	all;
	roots;

	#packageMap;

	constructor({ packages }: { packages: Package[] }) {
		this.all = packages;
		this.roots = this.all.filter(({ parentPackagePath }) => parentPackagePath === null);

		this.#packageMap = new Map(packages.map((pack) => [pack.path, pack]));
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

	isInAncestryBranch({ sourcePath, testablePath }: { sourcePath: string; testablePath: string }) {
		return this.#getAncestryBranch(sourcePath).some(({ path }) => path === testablePath);
	}

	isInSameOrAncestryBranch({ sourcePath, testablePath }: { sourcePath: string; testablePath: string }) {
		return sourcePath === testablePath || this.isInAncestryBranch({ sourcePath, testablePath });
	}

	getAncestryBranch(path: string) {
		return Array.from(this.#getAncestryBranch(path));
	}

	getWithAncestryBranch(path: string) {
		return [this.get(path), ...this.#getAncestryBranch(path)];
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
