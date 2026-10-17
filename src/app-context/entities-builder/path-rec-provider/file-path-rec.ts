import { assert } from "~/lib/err.ts";
import { dirname, extname } from "~/lib/upath.ts";
import { fileExtNames } from "~/project-specifics.ts";

import { PathRec } from "./path-rec.ts";

const supportedExtNames = fileExtNames as unknown as string[];

export class FilePathRec extends PathRec {
	readonly kind = "file";

	constructor({ basePath, path }: { basePath: string; path: string }) {
		super({ basePath, path, parentPath: dirname(path), childPaths: [] });

		const extName = extname(path);

		assert(
			supportedExtNames.includes(extName),
			`Unsupported file extension '${extName}'. Supported file extensions are: ${supportedExtNames.join(", ")}.`,
		);
	}
}
