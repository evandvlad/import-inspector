import { assertNever } from "~/lib/ts.ts";
import type { Json, Tags as ITags, ViewDataMode } from "~/api.ts";

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

	toViewData(mode: ViewDataMode = "brief"): Json {
		switch (mode) {
			case "minimal":
				return this.getAll().length;

			case "brief":
				return this.getAll();

			case "verbose":
				return Object.fromEntries(
					this.getAll().map((tag) => [tag, this.sample(tag).modPaths]),
				);

			default:
				assertNever(mode);
		}
	}
}
