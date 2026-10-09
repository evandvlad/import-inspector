import type { Dict, ExternalImportsSample as IExternalImportsSample } from "~/api.ts";

import type { Import } from "../import.ts";

export class ExternalImportsSample implements IExternalImportsSample {
	imports;
	locators;

	constructor({ imports }: { imports: Dict<Import> }) {
		this.imports = imports;

		this.locators = this.imports
			.group(({ locator }) => String(locator))
			.sortK((a, b) => a.localeCompare(b));
	}
}
