import { assert } from "~/lib/err.ts";
import { DefRefCached } from "~/lib/ref.ts";
import type { Dict, Module, Package, PathableEntities as IPathableEntities } from "~/api.ts";

export class PathableEntities<T extends Module | Package> implements IPathableEntities<T> {
	#byPathRef;

	constructor({ dict }: { dict: Dict<T> }) {
		this.#byPathRef = new DefRefCached(() => dict);
	}

	get total() {
		return this.byPath.size;
	}

	get paths() {
		return this.byPath.toKeys();
	}

	get byPath() {
		return this.#byPathRef.value;
	}

	has(id: string) {
		return this.byPath.has(id);
	}

	get(path: string) {
		const mod = this.find(path);
		assert(mod, `Can't get entity by path '${path}'.`);
		return mod;
	}

	find(path: string) {
		return this.byPath.getOrDefault(path, null);
	}
}
