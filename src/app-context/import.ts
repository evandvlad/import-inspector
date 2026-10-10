import { Dict } from "~/lib/dict.ts";
import type { Dict as IDict, Import as IImport } from "~/api.ts";
import type { ImportRec, ImportResolution } from "~/values.ts";

import { ImportDefect } from "./import-defect.ts";

export class Import implements IImport {
	id;
	locator;
	posSpan;
	isDynamic;
	source;
	resolution;
	defects: IDict<ImportDefect>;

	resolved;
	location;

	constructor(
		{ path, importRec, resolution }: { path: string; importRec: ImportRec; resolution: ImportResolution | null },
	) {
		this.id = crypto.randomUUID() as string;
		this.source = path;
		this.resolution = resolution;
		this.locator = importRec.locator;
		this.posSpan = importRec.posSpan;
		this.isDynamic = importRec.isDynamic;
		this.defects = new Dict();

		this.resolved = resolution?.path ?? null;
		this.location = this.resolved ?? this.locator;
	}

	addDefect(rule: string, description?: string) {
		this.defects.set(
			rule,
			new ImportDefect({
				rule,
				description,
				importId: this.id,
				posSpan: this.posSpan,
				locator: this.locator,
				source: this.source,
				resolved: this.resolved,
			}),
		);
	}
}
