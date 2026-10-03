import { assertNever } from "~/lib/ts.ts";
import type { Frames as IFrames, Json, ViewDataMode } from "~/api.ts";

import type { FrameRegistry } from "../frame-registry.ts";

import type { Module } from "../module.ts";

import type { Modules } from "./modules.ts";

export class Frames implements IFrames {
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

	getModulePathsByFrame(name: string) {
		return this.#frameRegistry.get(name);
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
					this.#frameRegistry.names.map((name) => [name, this.getModulePathsByFrame(name)]),
				);

			default:
				assertNever(mode);
		}
	}
}
