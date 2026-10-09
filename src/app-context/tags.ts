import type { Tags as ITags } from "~/api.ts";

import type { Modules } from "./modules.ts";
import { TagSample } from "./samples/tag.ts";

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
		return new TagSample({ name, modules: this.#modules });
	}
}
