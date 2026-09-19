import { parse } from "~/lib/upath.ts";

import type { FilePathRec, PathRecProvider } from "../path-rec-provider/index.ts";
import { orderedPackageEntryPointNames } from "../project-specifics.ts";

export class PackageEntryPointDetector {
	#pathRecProvider;

	constructor({ pathRecProvider }: { pathRecProvider: PathRecProvider }) {
		this.#pathRecProvider = pathRecProvider;
	}

	isOneOf(path: string) {
		const { name } = parse(path);
		return orderedPackageEntryPointNames.includes(name);
	}

	selectFromChildren(path: string) {
		const { childPaths } = this.#pathRecProvider.getDirPathRec(path);

		const filePathRecs = Iterator.from(childPaths)
			.map((path) => this.#pathRecProvider.getPathRec(path))
			.filter((pathRec): pathRec is FilePathRec => pathRec.kind === "file")
			.toArray();

		if (!filePathRecs.length) {
			return null;
		}

		const filePathRec = Iterator.from(orderedPackageEntryPointNames)
			.map((name) => filePathRecs.find(({ baseName }) => name === baseName))
			.find(Boolean);

		return filePathRec?.path ?? null;
	}
}
