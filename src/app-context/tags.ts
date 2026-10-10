import type { Tags as ITags } from "~/api.ts";
import { Dict } from "~/lib/dict.ts";

import type { Module } from "./module.ts";

export class Tags implements ITags {
	#modules;

	constructor({ modules }: { modules: Dict<Module> }) {
		this.#modules = modules;
	}

	get all() {
		// @TODO !!!
		const all = this.#modules.toArray().flatMap(({ tags }) => tags);
		return Array.from(new Set(all));
	}

	has(name: string) {
		return this.all.includes(name);
	}

	get(name: string) {
		return Dict.fromArray(
			// @TODO !!!
			this.#modules.toArray().filter((mod) => mod.hasTag(name)),
			({ path }) => path,
		);
	}
}
