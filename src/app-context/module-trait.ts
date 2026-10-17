import type { ModuleTrait as IModuleTrait } from "~/api.ts";

export class ModuleTrait implements IModuleTrait {
	#nameSet;

	constructor() {
		this.#nameSet = new Set<string>();
	}

	get total() {
		return this.#nameSet.size;
	}

	get names() {
		return Array.from(this.#nameSet);
	}

	has(name: string) {
		return this.#nameSet.has(name);
	}

	add(name: string) {
		this.#nameSet.add(name);
		return this;
	}

	remove(name: string) {
		this.#nameSet.delete(name);
		return this;
	}
}
