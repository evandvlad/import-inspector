import { assert } from "~/lib/err.ts";
import { dirname, extname } from "~/lib/upath.ts";

import { type FileExtName, fileExtNames, getFileExtInfo } from "../project-specifics.ts";

import { PathRec } from "./path-rec.ts";

const supportedExtNames = fileExtNames as unknown as string[];

export class FilePathRec extends PathRec {
	readonly kind = "file";

	extInfo;

	constructor({ path }: { path: string }) {
		super({ path, parentPath: dirname(path), childPaths: [] });

		const extName = extname(path);

		assert(
			supportedExtNames.includes(extName),
			`Unsupported file extension '${extName}'. Supported file extensions are: ${supportedExtNames.join(", ")}.`,
		);

		this.extInfo = getFileExtInfo(extName as FileExtName);
	}
}
