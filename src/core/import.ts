import type { Import as IImport, ImportDefect } from "~/api.ts";

import type { ImportRec, ImportResolution } from "./values.ts";

export class Import implements IImport {
	id;
	line;
	sourcePath;
	locator;
	code;
	isDynamic;
	resolution;
	defectMap = new Map<string, ImportDefect>();

	constructor({ importRec, resolution }: { importRec: ImportRec; resolution: ImportResolution | null }) {
		this.id = crypto.randomUUID() as string;
		this.line = importRec.line;
		this.sourcePath = importRec.filePathRec.path;
		this.locator = importRec.locator;
		this.code = importRec.code;
		this.isDynamic = importRec.isDynamic;
		this.resolution = resolution;
	}

	addDefect({ rule, description = "" }: { rule: string; description?: string }) {
		this.defectMap.set(rule, {
			rule,
			description,
			importId: this.id,
			line: this.line,
			code: this.code,
			locator: this.locator,
			sourcePath: this.sourcePath,
			importedPath: this.resolution?.path ?? null,
		});
	}

	removeDefect(rule: string) {
		this.defectMap.delete(rule);
	}
}
