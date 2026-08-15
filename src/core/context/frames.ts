import type { ContextFrames } from "~/api.ts";

import type { FrameRegistry } from "../frame-registry.ts";

import type { Modules } from "./modules.ts";

export class Frames implements ContextFrames {
	names;

	#modules;
	#frameRegistry;

	constructor({ frameRegistry, modules }: { frameRegistry: FrameRegistry; modules: Modules }) {
		this.#frameRegistry = frameRegistry;
		this.#modules = modules;

		this.names = frameRegistry.names;
	}

	getModulesByFrame(name: string) {
		const paths = this.#frameRegistry.get(name);
		return paths.map((path) => this.#modules.get(path));
	}

	isModuleInFrame({ path, name }: { path: string; name: string }) {
		const paths = this.#frameRegistry.get(name);
		return paths.includes(path);
	}
}
