import { assertNever } from "~/lib/ts.ts";
import type { Frames as IFrames, Json, ViewDataMode } from "~/api.ts";

import type { Module } from "./module.ts";
import type { Modules } from "./modules.ts";

export class Frames implements IFrames {
	#modules;

	constructor({ modules }: { modules: Modules }) {
		this.#modules = modules;
	}

	getAll() {
		const all = this.#modules.getAll().flatMap(({ frames }) => frames);
		return Array.from(new Set(all));
	}

	has(name: string) {
		return this.getAll().includes(name);
	}

	getModPaths(name: string) {
		return Iterator.from(this.#modules.getAll())
			.filter((mod) => mod.hasFrame(name))
			.map(({ path }) => path)
			.toArray();
	}

	getModPathInOtherFramesMap(path: string) {
		const mod = this.#modules.get(path);

		return mod.links.reduce((acc, link) => {
			const linkedMod = this.#modules.get(link);

			linkedMod.frames.forEach((name) => {
				if (mod.frames.includes(name)) {
					return;
				}

				acc.getOrInsert(name, []).push(link);
			});

			return acc;
		}, new Map<string, string[]>());
	}

	getFrameInFramesMap(name: string) {
		return this.getModPaths(name).reduce((acc, path) => {
			const imported = this.#modules.get(path);

			imported.links.forEach((link) => {
				const source = this.#modules.get(link);

				source.frames
					.filter((frameName) => frameName !== name)
					.forEach((frameName) => {
						acc.getOrInsert(frameName, []).push({ source, imported });
					});
			});

			return acc;
		}, new Map<string, Array<{ source: Module; imported: Module }>>());
	}

	toViewData(mode: ViewDataMode = "brief"): Json {
		switch (mode) {
			case "minimal":
				return this.getAll().length;

			case "brief":
				return this.getAll();

			case "verbose":
				return Object.fromEntries(
					this.getAll().map((name) => [name, this.getModPaths(name)]),
				);

			default:
				assertNever(mode);
		}
	}
}
