import type { Import as IImport, ImportDefect } from "~/api.ts";

import type { ImportRec, ImportResolution } from "./values.ts";

export class Import implements IImport {
	id;
	locator;
	posSpan;
	isDynamic;
	defectMap;
	sourcePath;
	resolution;

	constructor(
		{ path, importRec, resolution }: { path: string; importRec: ImportRec; resolution: ImportResolution | null },
	) {
		this.id = crypto.randomUUID() as string;
		this.sourcePath = path;
		this.resolution = resolution;
		this.locator = importRec.locator;
		this.posSpan = importRec.posSpan;
		this.isDynamic = importRec.isDynamic;
		this.defectMap = new Map<string, ImportDefect>();
	}

	addDefect({ rule, description = "" }: { rule: string; description?: string }) {
		this.defectMap.set(rule, {
			rule,
			description,
			importId: this.id,
			posSpan: this.posSpan,
			locator: this.locator,
			sourcePath: this.sourcePath,
			importedPath: this.resolution?.path ?? null,
		});
	}

	removeDefect(rule: string) {
		this.defectMap.delete(rule);
	}
}
