import type { TagSample as ITagSample } from "~/api.ts";
import { Dict } from "~/lib/dict.ts";

import type { Module } from "../module.ts";
import type { Modules } from "../modules.ts";

export class TagSample implements ITagSample {
	name;
	modPaths;
	modules;

	constructor({ name, modules }: { name: string; modules: Modules }) {
		this.name = name;

		this.modules = Dict.fromEntries(
			Iterator.from(modules.getAll())
				.filter((mod) => mod.hasTag(name))
				.map((mod) => [mod.path, mod] as [string, Module])
				.toArray(),
		);

		this.modPaths = this.modules.toKeys();
	}
}
