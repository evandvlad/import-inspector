import type { Imports as IImports } from "~/api.ts";
import { Dict } from "~/lib/dict.ts";

import type { Modules } from "./modules.ts";
import type { Import } from "./import.ts";
import { ExternalImportsSample } from "./samples/external-imports.ts";

export class Imports implements IImports {
	all;

	constructor({ modules }: { modules: Modules }) {
		this.all = Dict.fromEntries(
			modules.getAll().flatMap(({ imports }) => imports.map((imp) => [imp.id, imp] as [string, Import])),
		);
	}

	get local() {
		return this.all.filter(({ resolution }) => resolution && !resolution.isExternal);
	}

	get external() {
		const imports = this.all.filter(({ resolution }) => resolution && resolution.isExternal);
		return new ExternalImportsSample({ imports });
	}

	get fullResolved() {
		return this.all.filter(({ resolutionPath }) => Boolean(resolutionPath));
	}

	get fullUnresolved() {
		return this.all.filter(({ locator, isDynamic, resolution }) => {
			if (!locator) {
				return true;
			}

			return isDynamic && resolution && !resolution.isExternal && !resolution.path;
		});
	}

	get localUnresolved() {
		return this.local.filter(({ resolutionPath }) => !resolutionPath);
	}

	get dynamic() {
		return this.all.filter(({ isDynamic }) => isDynamic);
	}

	get static() {
		return this.all.filter(({ isDynamic }) => !isDynamic);
	}
}
