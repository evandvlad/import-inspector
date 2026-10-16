import type { Dict, Frame_v1, Frames_v1, Module_v1 } from "~/api.ts";

import { Frame } from "./frame.ts";

export class Frames implements Frames_v1 {
	#modules;

	constructor({ modules }: { modules: Dict<Module_v1> }) {
		this.#modules = modules;
	}

	get names() {
		return this.byFrame.toKeys();
	}

	get byFrame() {
		return this.#modules.fold<Frame_v1>((acc, { frames }) => {
			frames.forEach((frame) => {
				if (!acc.has(frame)) {
					acc.set(frame, new Frame({ name: frame, modules: this.#modules }));
				}
			});

			return acc;
		});
	}

	has(name: string) {
		return this.byFrame.has(name);
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
		return this.#getModPaths(name).reduce((acc, path) => {
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
		}, new Map<string, Array<{ source: Module_v1; imported: Module_v1 }>>());
	}

	#getModPaths(name: string) {
		return Iterator.from(this.#modules.toArray())
			.filter((mod) => mod.hasFrame(name))
			.map(({ path }) => path)
			.toArray();
	}
}
