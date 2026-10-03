import { assert } from "~/lib/err.ts";
import { assertNever } from "~/lib/ts.ts";
import type { Json, Modules as IModules, ViewDataMode } from "~/api.ts";

import type { Module } from "./module.ts";

export class Modules implements IModules {
	#all;
	#moduleMap;

	constructor({ modules }: { modules: Module[] }) {
		this.#all = modules;
		this.#moduleMap = new Map(modules.map((mod) => [mod.path, mod]));
	}

	getAll() {
		return this.#all;
	}

	find(path: string) {
		return this.#moduleMap.get(path) ?? null;
	}

	get(path: string) {
		const mod = this.find(path);
		assert(mod, `Can't find module for path '${path}'.`);
		return mod;
	}

	toViewData(mode: ViewDataMode = "brief"): Json {
		switch (mode) {
			case "minimal":
				return this.getAll().length;

			case "brief":
				return this.getAll().map((mod) => mod.toViewData("minimal"));

			case "verbose":
				return this.getAll().map((mod) => mod.toViewData("verbose"));

			default:
				assertNever(mode);
		}
	}
}
