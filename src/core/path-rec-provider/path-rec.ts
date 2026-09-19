import { parse } from "~/lib/upath.ts";

export abstract class PathRec {
	abstract kind: "file" | "dir";

	path;
	name;
	baseName;
	parentPath;
	childPaths;

	constructor({ path, parentPath, childPaths }: { path: string; parentPath: string | null; childPaths: string[] }) {
		this.path = path;
		this.parentPath = parentPath;
		this.childPaths = childPaths;

		const { base, name } = parse(path);

		this.baseName = name;
		this.name = base;
	}
}
