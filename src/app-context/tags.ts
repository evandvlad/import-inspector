import type { Tags as ITags } from "~/api.ts";

import type { Modules } from "./modules.ts";
import { TagSample } from "./samples/tag.ts";

export class Tags implements ITags {
	#modules;

	constructor({ modules }: { modules: Modules }) {
		this.#modules = modules;
	}

	getAll() {
		const all = this.#modules.getAll().flatMap(({ tags }) => tags);
		return Array.from(new Set(all));
	}

	has(name: string) {
		return this.getAll().includes(name);
	}

	sample(name: string) {
		return new TagSample({ name, modules: this.#modules });
	}
}
