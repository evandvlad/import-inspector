import { orderedPackEntryPointNames } from "~/project-specifics.ts";

import type { FilePathRec, PathRecProvider } from "./path-rec-provider/index.ts";

export class PackEntryPointDetector {
	#pathRecProvider;

	constructor({ pathRecProvider }: { pathRecProvider: PathRecProvider }) {
		this.#pathRecProvider = pathRecProvider;
	}

	isOneOf(path: string) {
		const { name } = this.#pathRecProvider.getFilePathRec(path);
		return orderedPackEntryPointNames.includes(name);
	}

	selectFromChildren(path: string) {
		const { childPaths } = this.#pathRecProvider.getDirPathRec(path);

		const filePathRecs = Iterator.from(childPaths)
			.map((path) => this.#pathRecProvider.getPathRec(path))
			.filter((pathRec): pathRec is FilePathRec => pathRec.kind === "file")
			.toArray();

		if (filePathRecs.length === 0) {
			return null;
		}

		const filePathRec = Iterator.from(orderedPackEntryPointNames)
			.map((name) => filePathRecs.find((pathRec) => pathRec.name === name))
			.find(Boolean);

		return filePathRec?.path ?? null;
	}
}
