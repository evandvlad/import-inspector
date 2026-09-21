import { assert } from "~/lib/err.ts";
import type { ContextModules } from "~/api.ts";

import type { Module } from "../module.ts";

export class Modules implements ContextModules {
	#all;
	#moduleMap;

	constructor({ modules }: { modules: Module[] }) {
		this.#all = modules;
		this.#moduleMap = new Map(modules.map((module) => [module.path, module]));
	}

	getAll() {
		return this.#all;
	}

	find(path: string) {
		return this.#moduleMap.get(path) ?? null;
	}

	get(path: string) {
		const module = this.find(path);
		assert(module, `Can't find module for path '${path}'.`);
		return module;
	}
}
