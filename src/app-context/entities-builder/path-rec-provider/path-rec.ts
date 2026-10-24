import { parse, shorten, stripEnd } from "~/lib/upath.ts";
import type { Nullable } from "~/lib/ts.ts";

export abstract class PathRec {
	abstract kind: "file" | "dir";

	path;
	name;
	baseName;
	shortPath;
	parentPath;
	childPaths;

	constructor(
		{ basePath, path, parentPath, childPaths }: {
			path: string;
			basePath: string;
			parentPath: Nullable<string>;
			childPaths: string[];
		},
	) {
		this.path = path;
		this.shortPath = shorten(stripEnd(path), basePath);
		this.parentPath = parentPath;
		this.childPaths = childPaths;

		const { base, name } = parse(path);

		this.baseName = base;
		this.name = name;
	}
}
