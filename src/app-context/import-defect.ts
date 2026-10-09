import type { ImportDefect as IImportDefect, Span } from "~/api.ts";

export class ImportDefect implements IImportDefect {
	rule;
	posSpan;
	locator;
	importId;
	sourcePath;
	description;
	importedPath;

	info;
	imported;

	constructor(
		{ rule, importId, posSpan, locator, sourcePath, importedPath, description = "" }: {
			rule: string;
			importId: string;
			posSpan: Span;
			locator: string | null;
			sourcePath: string;
			importedPath: string | null;
			description?: string;
		},
	) {
		this.rule = rule;
		this.importId = importId;
		this.posSpan = posSpan;
		this.locator = locator;
		this.sourcePath = sourcePath;
		this.importedPath = importedPath;
		this.description = description;

		this.info = `${rule}${description ? ` (${description})` : ""}`;
		this.imported = this.importedPath ?? this.locator;
	}
}
