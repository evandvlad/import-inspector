import { orderedPackageEntryPointNames } from "~/project-specifics.ts";

import type { FilePathRec, PathRecProvider } from "./path-rec-provider/index.ts";

export class PackageEntryPointDetector {
	#pathRecProvider;

	constructor({ pathRecProvider }: { pathRecProvider: PathRecProvider }) {
		this.#pathRecProvider = pathRecProvider;
	}

	isOneOf(path: string) {
		const { baseName } = this.#pathRecProvider.getFilePathRec(path);
		return orderedPackageEntryPointNames.includes(baseName);
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

		const filePathRec = Iterator.from(orderedPackageEntryPointNames)
			.map((name) => filePathRecs.find(({ baseName }) => name === baseName))
			.find(Boolean);

		return filePathRec?.path ?? null;
	}
}
