import type { Dict as IDict, Module_v1, Tags_v1 } from "~/api.ts";
import { Dict } from "~/lib/dict.ts";

export class Tags implements Tags_v1 {
	#modules;

	constructor({ modules }: { modules: IDict<Module_v1> }) {
		this.#modules = modules;
	}

	has(name: string) {
		return this.byTag.has(name);
	}

	get names() {
		return this.byTag.toKeys();
	}

	get byTag() {
		return this.#modules.fold<IDict<Module_v1>>((acc, mod) => {
			mod.tags.forEach((tag) => {
				acc.getOrInsert(tag, Dict.empty<Module_v1>()).set(mod.path, mod);
			});

			return acc;
		});
	}
}
