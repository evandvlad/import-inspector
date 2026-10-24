import { isSubpathOf } from "~/lib/upath.ts";

import type { DirPathRec, PathRec, PathRecProvider } from "./path-rec-provider/index.ts";
import type { PackEntryPointDetector } from "./pack-entry-point-detector.ts";

export class PackFinder {
	#pathRecProvider;
	#packEntryPointDetector;

	constructor(
		{ pathRecProvider, packEntryPointDetector }: {
			pathRecProvider: PathRecProvider;
			packEntryPointDetector: PackEntryPointDetector;
		},
	) {
		this.#pathRecProvider = pathRecProvider;
		this.#packEntryPointDetector = packEntryPointDetector;
	}

	findCurrent(path: string) {
		const { parentPath } = this.#pathRecProvider.getPathRec(path);

		if (!parentPath) {
			return null;
		}

		const dirPathRec = this.#pathRecProvider.createUpWalker<DirPathRec>(parentPath)
			.filter((dirPathRec) =>
				Iterator.from(dirPathRec.childPaths)
					.map(this.#mapPathToPathRec)
					.find(this.#isPackEntryPoint)
			)
			.find(Boolean);

		return dirPathRec?.path ?? null;
	}

	findChildren(path: string): string[] {
		const { childPaths } = this.#pathRecProvider.getDirPathRec(path);

		return Iterator.from(childPaths)
			.map(this.#mapPathToPathRec)
			.filter((pathRec) => pathRec.kind === "dir")
			.flatMap((pathRec) => {
				const children: string[] = [];

				return this.#pathRecProvider.createDownWalker(pathRec.path)
					.filter(this.#isPackEntryPoint)
					.map((filePathRec) => {
						const parentPath = filePathRec.parentPath!;
						children.push(parentPath);
						return parentPath;
					})
					.filter((path) => {
						return !children.some((childPath) =>
							path.length > childPath.length && isSubpathOf(path, childPath)
						);
					});
			})
			.toArray();
	}

	#isPackEntryPoint = (pathRec: PathRec) => {
		return pathRec.kind === "file" && this.#packEntryPointDetector.isOneOf(pathRec.path);
	};

	#mapPathToPathRec = (path: string) => {
		return this.#pathRecProvider.getPathRec(path);
	};
}
