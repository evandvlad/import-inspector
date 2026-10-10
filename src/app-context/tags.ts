import type { Dict as IDict, Module, Tags as ITags } from "~/api.ts";
import { Dict } from "~/lib/dict.ts";

export class Tags implements ITags {
	#modules;

	constructor({ modules }: { modules: IDict<Module> }) {
		this.#modules = modules;
	}

	has(name: string) {
		return this.byTag.has(name);
	}

	get names() {
		return this.byTag.toKeys();
	}

	get byTag() {
		return this.#modules.fold<IDict<Module>>((acc, mod) => {
			mod.tags.forEach((tag) => {
				acc.getOrInsert(tag, new Dict<Module>()).set(mod.path, mod);
			});

			return acc;
		});
	}
}
