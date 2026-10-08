import type { TagSample as ITagSample } from "~/api.ts";

import type { Modules } from "../modules.ts";

export class TagSample implements ITagSample {
	name;
	modPaths;

	constructor({ name, modules }: { name: string; modules: Modules }) {
		this.name = name;

		this.modPaths = Iterator.from(modules.getAll())
			.filter((mod) => mod.hasTag(name))
			.map(({ path }) => path)
			.toArray();
	}
}
