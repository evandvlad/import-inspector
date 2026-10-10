import type { Dict, Frame as IFrame, Module } from "~/api.ts";

export class Frame implements IFrame {
	name;

	#modules;

	constructor({ name, modules }: { name: string; modules: Dict<Module> }) {
		this.name = name;
		this.#modules = modules;
	}

	get modules() {
		return this.#modules.filter(({ frames }) => frames.includes(name));
	}
}
