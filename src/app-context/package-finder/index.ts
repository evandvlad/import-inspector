import type { DirPathRec, PathRec, PathRecProvider } from "../path-rec-provider/index.ts";
import type { PackageEntryPointDetector } from "../package-entry-point-detector/index.ts";

export class PackageFinder {
	#pathRecProvider;
	#packageEntryPointDetector;

	constructor(
		{ pathRecProvider, packageEntryPointDetector }: {
			pathRecProvider: PathRecProvider;
			packageEntryPointDetector: PackageEntryPointDetector;
		},
	) {
		this.#pathRecProvider = pathRecProvider;
		this.#packageEntryPointDetector = packageEntryPointDetector;
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
					.find(this.#isPackageEntryPoint)
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
				const subPackagePaths: string[] = [];

				return this.#pathRecProvider.createDownWalker(pathRec.path)
					.filter(this.#isPackageEntryPoint)
					.map((filePathRec) => {
						const parentPath = filePathRec.parentPath!;
						subPackagePaths.push(parentPath);
						return parentPath;
					})
					.filter((path) =>
						!subPackagePaths
							.some((subPackagePath) =>
								path.length > subPackagePath.length && path.startsWith(subPackagePath)
							)
					);
			})
			.toArray();
	}

	#isPackageEntryPoint = (pathRec: PathRec) => {
		return pathRec.kind === "file" && this.#packageEntryPointDetector.isOneOf(pathRec.path);
	};

	#mapPathToPathRec = (path: string) => {
		return this.#pathRecProvider.getPathRec(path);
	};
}
