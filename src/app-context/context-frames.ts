import { assert } from "~/lib/err.ts";
import type { AppContextFrame, AppContextFrames, Dict, Module } from "~/api.d.ts";

import { cache } from "./tag-based-cache.ts";
import { ContextFrame } from "./context-frame.ts";

export class ContextFrames implements AppContextFrames {
	#modDict;

	constructor({ modDict }: { modDict: Dict<Module> }) {
		this.#modDict = modDict;
	}

	get size() {
		return this.byName.size;
	}

	get names() {
		return this.byName.toKeys();
	}

	@cache("frames")
	get byName() {
		return this.#modDict.fold<AppContextFrame>((acc, mod) => {
			mod.frames.names.forEach((name) => {
				if (!acc.has(name)) {
					acc.set(name, new ContextFrame({ name, modDict: this.#modDict }));
				}
			});

			return acc;
		});
	}

	has(name: string) {
		return this.byName.has(name);
	}

	get(name: string) {
		const frame = this.find(name);
		assert(frame, `Can't get frame by name '${name}'.`);
		return frame;
	}

	find(name: string) {
		return this.byName.getOrDefault(name, null);
	}
}
