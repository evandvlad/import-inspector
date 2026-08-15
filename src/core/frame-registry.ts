import type { Config } from "./config.ts";
import type { PathRecProvider } from "./path-rec-provider/index.ts";

export class FrameRegistry {
	names;

	#frameMap;

	constructor({ config, pathRecProvider }: { config: Config; pathRecProvider: PathRecProvider }) {
		this.#frameMap = this.#createFrameMap({ config, pathRecProvider });
		this.names = Array.from(this.#frameMap.keys());
	}

	get(name: string) {
		return this.#frameMap.get(name) ?? [];
	}

	getByPath(path: string) {
		return this.#frameMap.values().filter((paths) => paths.includes(path)).toArray();
	}

	getNamesByPath(path: string) {
		return this.#frameMap.entries()
			.filter(([_, paths]) => paths.includes(path))
			.map(([name]) => name)
			.toArray();
	}

	#createFrameMap({ config, pathRecProvider }: { config: Config; pathRecProvider: PathRecProvider }) {
		const frameList = Object.entries(config.frames)
			.map(([name, rootPathPrefixes]) => ({ name, rootPathPrefixes }));

		const map = new Map<string, string[]>();

		pathRecProvider.filePaths.forEach((path) => {
			frameList.forEach(({ name, rootPathPrefixes }) => {
				rootPathPrefixes.forEach((rootPathPrefix) => {
					if (path.startsWith(rootPathPrefix)) {
						const items = map.getOrInsert(name, []);
						items.push(path);
					}
				});
			});
		});

		return map;
	}
}
