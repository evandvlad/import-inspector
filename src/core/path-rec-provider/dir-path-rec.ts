import { dirname } from "~/lib/upath.ts";

import { PathRec } from "./path-rec.ts";

export class DirPathRec extends PathRec {
	readonly kind = "dir";

	constructor({ basePath, path, childPaths }: { basePath: string; path: string; childPaths: string[] }) {
		const parentDir = dirname(path);
		const parentPath = basePath === parentDir ? null : parentDir;

		super({ path, parentPath, childPaths });
	}
}
