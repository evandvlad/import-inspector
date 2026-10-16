import type { Dict, Frame_v1, Module_v1 } from "~/api.ts";

export class Frame implements Frame_v1 {
	name;

	#modules;

	constructor({ name, modules }: { name: string; modules: Dict<Module_v1> }) {
		this.name = name;
		this.#modules = modules;
	}

	get modules() {
		return this.#modules.filter(({ frames }) => frames.includes(name));
	}
}
