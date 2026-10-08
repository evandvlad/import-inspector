import type { ExternalImportsSample as IExternalImportsSample } from "~/api.ts";

import type { Import } from "../import.ts";

export class ExternalImportsSample implements IExternalImportsSample {
	imports;
	locators;

	#importsMap;

	constructor({ imports }: { imports: Import[] }) {
		this.imports = imports;

		this.#importsMap = imports.reduce((acc, imp) => {
			acc.getOrInsert(String(imp.locator), []).push(imp);
			return acc;
		}, new Map<string, Import[]>());

		this.locators = Array.from(this.#importsMap.keys())
			.toSorted((a, b) => a.localeCompare(b));
	}

	get(locator: string) {
		return this.#importsMap.get(locator) ?? [];
	}
}
