import type { ModTrait } from "~/api.d.ts";

import { clear } from "./tag-based-cache.ts";

export class Frames implements ModTrait {
	#nameSet;

	constructor() {
		this.#nameSet = new Set<string>();
	}

	get size() {
		return this.#nameSet.size;
	}

	get names() {
		return Array.from(this.#nameSet);
	}

	has(name: string) {
		return this.#nameSet.has(name);
	}

	@clear("frames")
	add(name: string) {
		this.#nameSet.add(name);
		return this;
	}

	@clear("frames")
	remove(name: string) {
		this.#nameSet.delete(name);
		return this;
	}
}
