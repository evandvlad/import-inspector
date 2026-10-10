import type { Imports as IImports } from "~/api.ts";
import { Dict } from "~/lib/dict.ts";

import type { Import } from "./import.ts";
import type { Module } from "./module.ts";

export class Imports implements IImports {
	all;

	constructor({ modules }: { modules: Dict<Module> }) {
		this.all = modules.reduce(
			(acc, { imports }) => acc.merge(Dict.fromArray(imports, ({ id }) => id)),
			new Dict<Import>(),
		);
	}

	get local() {
		return this.all.filter(({ resolution }) => resolution && !resolution.isExternal);
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

	get external() {
		return this.all.filter(({ resolution }) => resolution && resolution.isExternal);
	}

	get extLocators() {
		return this.external
			.group(({ locator }) => String(locator))
			.sortK((a, b) => a.localeCompare(b));
	}
}
