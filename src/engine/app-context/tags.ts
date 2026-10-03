import { assertNever } from "~/lib/ts.ts";
import type { Json, Tags as ITags, ViewDataMode } from "~/api.ts";

import type { Modules } from "./modules.ts";

export class Tags implements ITags {
	#modules;

	constructor({ modules }: { modules: Modules }) {
		this.#modules = modules;
	}

	getAll() {
		const all = this.#modules.getAll().flatMap(({ tags }) => tags);
		return Array.from(new Set(all));
	}

	getModulePathsByTag(tag: string) {
		return Iterator.from(this.#modules.getAll())
			.filter((mod) => mod.hasTag(tag))
			.map(({ path }) => path)
			.toArray();
	}

	toViewData(mode: ViewDataMode = "brief"): Json {
		switch (mode) {
			case "minimal":
				return this.getAll().length;

			case "brief":
				return this.getAll();

			case "verbose":
				return Object.fromEntries(
					this.getAll().map((tag) => [tag, this.getModulePathsByTag(tag)]),
				);

			default:
				assertNever(mode);
		}
	}
}
