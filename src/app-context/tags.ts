import type { Tags as ITags } from "~/api.ts";
import { Dict } from "~/lib/dict.ts";

import type { Modules } from "./modules.ts";

export class Tags implements ITags {
	#modules;

	constructor({ modules }: { modules: Modules }) {
		this.#modules = modules;
	}

	get all() {
		const all = this.#modules.getAll().flatMap(({ tags }) => tags);
		return Array.from(new Set(all));
	}

	has(name: string) {
		return this.all.includes(name);
	}

	get(name: string) {
		return Dict.fromArray(
			this.#modules.getAll().filter((mod) => mod.hasTag(name)),
			({ path }) => path,
		);
	}
}
