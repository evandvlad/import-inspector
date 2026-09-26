import { assert } from "~/lib/err.ts";
import type { ContextImports, Import } from "~/api.ts";

import type { Modules } from "./modules.ts";

export class Imports implements ContextImports {
	#all;
	#modules;
	#importMap;

	constructor({ modules }: { modules: Modules }) {
		this.#modules = modules;

		this.#importMap = new Map(
			modules.getAll().flatMap(({ importMap }) => Array.from(importMap.entries())),
		);

		this.#all = Array.from(this.#importMap.values());
	}

	getAll() {
		return this.#all;
	}

	getFullResolved() {
		return this.#all.filter(({ resolution }) => Boolean(resolution?.path));
	}

	getFullUnresolved() {
		return this.#all.filter(({ locator, isDynamic, resolution }) => {
			if (!locator) {
				return true;
			}

			return isDynamic && resolution && !resolution.isExternal && !resolution.path;
		});
	}

	getDynamic() {
		return this.#all.filter(({ isDynamic }) => isDynamic);
	}

	getStatic() {
		return this.#all.filter(({ isDynamic }) => !isDynamic);
	}

	getExternalMap() {
		return Iterator.from(this.#all)
			.filter(({ locator, resolution }) => Boolean(locator && resolution?.isExternal))
			.reduce((acc, imp) => {
				const imports = acc.getOrInsert(imp.locator!, []);
				imports.push(imp);
				return acc;
			}, new Map<string, Import[]>());
	}

	find(id: string) {
		return this.#importMap.get(id) ?? null;
	}

	get(id: string) {
		const imp = this.find(id);
		assert(imp, `Can't find import entry with id '${id}'.`);
		return imp;
	}

	findModule(id: string) {
		const imp = this.find(id);
		return imp ? this.#modules.find(imp.sourcePath) : null;
	}

	getModule(id: string) {
		const module = this.findModule(id);
		assert(module, `Can't find module for import id '${id}'.`);
		return module;
	}
}
