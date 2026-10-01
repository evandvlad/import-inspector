import { assert } from "~/lib/err.ts";
import { assertNever } from "~/lib/ts.ts";
import type { ContextImports, Json, ViewDataMode } from "~/api.ts";

import type { Import } from "../import.ts";

import type { Modules } from "./modules.ts";

export class Imports implements ContextImports {
	#all;
	#importMap;

	constructor({ modules }: { modules: Modules }) {
		this.#importMap = new Map(
			modules.getAll().flatMap(({ imports }) => imports.map((imp) => [imp.id, imp])),
		);

		this.#all = Array.from(this.#importMap.values());
	}

	getAll() {
		return this.#all;
	}

	getLocal() {
		return this.#all.filter(({ resolution }) => resolution && !resolution.isExternal);
	}

	getExternal() {
		return this.#all.filter(({ resolution }) => resolution && resolution.isExternal);
	}

	getFullResolved() {
		return this.#all.filter(({ resolutionPath }) => Boolean(resolutionPath));
	}

	getFullUnresolved() {
		return this.#all.filter(({ locator, isDynamic, resolution }) => {
			if (!locator) {
				return true;
			}

			return isDynamic && resolution && !resolution.isExternal && !resolution.path;
		});
	}

	getLocalUnresolved() {
		return this.getLocal().filter(({ resolutionPath }) => !resolutionPath);
	}

	getDynamic() {
		return this.#all.filter(({ isDynamic }) => isDynamic);
	}

	getStatic() {
		return this.#all.filter(({ isDynamic }) => !isDynamic);
	}

	getExternalMap() {
		return this.getExternal().reduce((acc, imp) => {
			acc.getOrInsert(String(imp.locator), []).push(imp);
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

	toViewData(mode: ViewDataMode = "brief"): Json {
		switch (mode) {
			case "minimal":
				return this.getAll().length;

			case "brief":
				return this.getAll().map((imp) => imp.toViewData("minimal"));

			case "verbose":
				return this.getAll().map((imp) => imp.toViewData("verbose"));

			default:
				assertNever(mode);
		}
	}
}
