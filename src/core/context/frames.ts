import type { ContextFrames, Module } from "~/api.ts";

import type { FrameRegistry } from "../frame-registry.ts";

import type { Modules } from "./modules.ts";

export class Frames implements ContextFrames {
	#modules;
	#frameRegistry;

	constructor({ frameRegistry, modules }: { frameRegistry: FrameRegistry; modules: Modules }) {
		this.#frameRegistry = frameRegistry;
		this.#modules = modules;
	}

	getAll() {
		return this.#frameRegistry.names;
	}

	getPathPrefixes(name: string) {
		return this.#frameRegistry.getPathPrefixes(name);
	}

	getModulesByFrame(name: string) {
		const paths = this.#frameRegistry.get(name);
		return paths.map((path) => this.#modules.get(path));
	}

	isModuleInFrame({ path, name }: { path: string; name: string }) {
		const paths = this.#frameRegistry.get(name);
		return paths.includes(path);
	}

	getImportedFramesMap(name: string) {
		return this.getModulesByFrame(name).reduce((acc, mod) => {
			mod.importMap
				.values()
				.forEach(({ resolution }) => {
					const path = resolution?.path;

					if (!path) {
						return;
					}

					const importedModule = this.#modules.get(path);

					importedModule.frameSet
						.values()
						.filter((frameName) => frameName !== name)
						.forEach((frameName) => {
							acc.getOrInsert(frameName, []).push({ source: mod, imported: importedModule });
						});
				});

			return acc;
		}, new Map<string, Array<{ source: Module; imported: Module }>>());
	}
}
