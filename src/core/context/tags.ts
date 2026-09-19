import type { ContextTags } from "~/api.ts";

import type { Modules } from "./modules.ts";

export class Tags implements ContextTags {
	#modules;

	constructor({ modules }: { modules: Modules }) {
		this.#modules = modules;
	}

	getAll() {
		const all = this.#modules.getAll().flatMap(({ tagSet }) => Array.from(tagSet));
		return Array.from(new Set(all));
	}

	getModulesByTag(tag: string) {
		return this.#modules.getAll().filter(({ tagSet }) => tagSet.has(tag));
	}
}
