import type { Settings } from "~/settings.ts";

import type { PathRecProvider } from "./path-rec-provider/index.ts";

export class FrameRegistry {
	names;

	#frameSettings;
	#frameMap;

	constructor({ settings, pathRecProvider }: { settings: Settings; pathRecProvider: PathRecProvider }) {
		this.#frameSettings = settings.frames;
		this.#frameMap = this.#createFrameMap({ settings, pathRecProvider });
		this.names = Array.from(this.#frameMap.keys());
	}

	get(name: string) {
		return this.#frameMap.get(name) ?? [];
	}

	getPathPrefixes(name: string) {
		return Object.hasOwn(this.#frameSettings, name) ? this.#frameSettings[name] : [];
	}

	getNamesByPath(path: string) {
		return this.#frameMap.entries()
			.filter(([_, paths]) => paths.includes(path))
			.map(([name]) => name)
			.toArray();
	}

	#createFrameMap({ settings, pathRecProvider }: { settings: Settings; pathRecProvider: PathRecProvider }) {
		const frameList = Object.entries(settings.frames)
			.map(([name, pathPrefixes]) => ({ name, pathPrefixes }));

		const map = new Map<string, string[]>();

		pathRecProvider.filePaths.forEach((path) => {
			frameList.forEach(({ name, pathPrefixes }) => {
				pathPrefixes.forEach((pathPrefix) => {
					if (path.startsWith(pathPrefix)) {
						const items = map.getOrInsert(name, []);
						items.push(path);
					}
				});
			});
		});

		return map;
	}
}
