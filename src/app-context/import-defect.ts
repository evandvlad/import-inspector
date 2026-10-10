import type { ImportDefect as IImportDefect, Span } from "~/api.ts";

export class ImportDefect implements IImportDefect {
	rule;
	posSpan;
	locator;
	importId;
	source;
	description;
	resolved;

	info;
	imported;

	constructor(
		{ rule, importId, posSpan, locator, source, resolved, description = "" }: {
			rule: string;
			importId: string;
			posSpan: Span;
			locator: string | null;
			source: string;
			resolved: string | null;
			description?: string;
		},
	) {
		this.rule = rule;
		this.importId = importId;
		this.posSpan = posSpan;
		this.locator = locator;
		this.source = source;
		this.resolved = resolved;
		this.description = description;

		this.info = `${rule}${description ? ` (${description})` : ""}`;
		this.imported = this.resolved ?? this.locator;
	}
}
