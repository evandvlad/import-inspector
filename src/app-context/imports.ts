import { assert } from "~/lib/err.ts";
import type { Imports as IImports } from "~/api.ts";

import type { Modules } from "./modules.ts";
import { ExternalImportsSample } from "./samples/external-imports.ts";

export class Imports implements IImports {
	#all;
	#importMap;

	constructor({ modules }: { modules: Modules }) {
		this.#importMap = new Map(
			modules.getAll().flatMap(({ imports }) => imports.map((imp) => [imp.id, imp])),
		);

		this.#all = Array.from(this.#importMap.values());
	}

	getAll() {
		return this.#all;
	}

	getLocal() {
		return this.#all.filter(({ resolution }) => resolution && !resolution.isExternal);
	}

	getExternal() {
		return this.#all.filter(({ resolution }) => resolution && resolution.isExternal);
	}

	getFullResolved() {
		return this.#all.filter(({ resolutionPath }) => Boolean(resolutionPath));
	}

	getFullUnresolved() {
		return this.#all.filter(({ locator, isDynamic, resolution }) => {
			if (!locator) {
				return true;
			}

			return isDynamic && resolution && !resolution.isExternal && !resolution.path;
		});
	}

	getLocalUnresolved() {
		return this.getLocal().filter(({ resolutionPath }) => !resolutionPath);
	}

	getDynamic() {
		return this.#all.filter(({ isDynamic }) => isDynamic);
	}

	getStatic() {
		return this.#all.filter(({ isDynamic }) => !isDynamic);
	}

	sampleExternal() {
		return new ExternalImportsSample({ imports: this.getExternal() });
	}

	find(id: string) {
		return this.#importMap.get(id) ?? null;
	}

	get(id: string) {
		const imp = this.find(id);
		assert(imp, `Can't find import entry with id '${id}'.`);
		return imp;
	}
}
