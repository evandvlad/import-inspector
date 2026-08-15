import { assert } from "~/lib/err.ts";

import { common, shorten, split, stripEnd } from "../lib/path.ts";

import type { DirPathRec } from "./dir-path-rec.ts";
import type { FilePathRec } from "./file-path-rec.ts";
import { createPathRecTree, type Node } from "./path-rec-tree.ts";

type PathRec = FilePathRec | DirPathRec;

export type { DirPathRec, FilePathRec, PathRec };

export class PathRecProvider {
	basePath;
	filePaths;

	#pathRecTree;

	constructor({ filePaths }: { filePaths: string[] }) {
		assert(
			filePaths.length > 1,
			`More than one file path is required for file processing, but ${filePaths.length} were given.`,
		);

		this.filePaths = filePaths;
		this.basePath = stripEnd(common(filePaths));
		this.#pathRecTree = createPathRecTree({ basePath: this.basePath, filePaths });
	}

	findFilePathRec(path: string) {
		const pathRec = this.findPathRec(path);
		return pathRec?.kind === "file" ? pathRec : null;
	}

	getFilePathRec(path: string) {
		const filePathRec = this.findFilePathRec(path);
		assert(filePathRec, `Can't find the file path rec by the path '${path}'.`);
		return filePathRec!;
	}

	findDirPathRec(path: string) {
		const pathRec = this.findPathRec(path);
		return pathRec?.kind === "dir" ? pathRec : null;
	}

	getDirPathRec(path: string) {
		const dirPathRec = this.findDirPathRec(path);
		assert(dirPathRec, `Can't find the dir path rec by the path '${path}'.`);
		return dirPathRec!;
	}

	findPathRec(path: string) {
		const normalizedPath = stripEnd(path);

		assert(
			normalizedPath.length > this.basePath.length,
			`The path '${path}' is out of scope. The scope is restricted to the base path which is '${this.basePath}'.`,
		);

		const shortPath = shorten(normalizedPath, this.basePath);

		return split(shortPath)
			.reduce<Node | undefined>((node, part) => node?.children.get(part), this.#pathRecTree)
			?.value ?? null;
	}

	getPathRec(path: string) {
		const pathRec = this.findPathRec(path);
		assert(pathRec, `Can't find the path rec by the path '${path}'.`);
		return pathRec!;
	}

	*createUpWalker<T extends PathRec = PathRec>(path: string): Generator<T, void> {
		let pathRec: PathRec | null = this.findPathRec(path);

		while (pathRec !== null) {
			yield pathRec as T;
			pathRec = pathRec.parentPath ? this.getDirPathRec(pathRec.parentPath) : null;
		}
	}

	*createDownWalker(path: string): Generator<PathRec, void> {
		for (const childPath of this.getPathRec(path).childPaths) {
			const pathDir = this.getPathRec(childPath);

			yield pathDir;
			yield* this.createDownWalker(pathDir.path);
		}
	}
}
