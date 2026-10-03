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

	getModulePathsByFrame(frame: string) {
		return Iterator.from(this.#modules.getAll())
			.filter((mod) => mod.hasFrame(frame))
			.map(({ path }) => path)
			.toArray();
	}

	isModuleInFrame({ path, name }: { path: string; name: string }) {
		const paths = this.getModulePathsByFrame(name);
		return paths.includes(path);
	}

	getImportedFramesMap(name: string) {
		return this.getModulePathsByFrame(name).reduce((acc, path) => {
			const mod = this.#modules.get(path);

			mod.imports.forEach(({ resolutionPath }) => {
				if (!resolutionPath) {
					return;
				}

				const importedModule = this.#modules.get(resolutionPath);

				importedModule.frames
					.filter((frameName) => frameName !== name)
					.forEach((frameName) => {
						acc.getOrInsert(frameName, []).push({ source: mod, imported: importedModule });
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
					this.getAll().map((frame) => [frame, this.getModulePathsByFrame(frame)]),
				);

			default:
				assertNever(mode);
		}
	}
}
