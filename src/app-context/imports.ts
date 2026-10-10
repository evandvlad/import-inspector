import type { Dict, Import, Imports as IImports, Module } from "~/api.ts";

export class Imports implements IImports {
	all;

	constructor({ modules }: { modules: Dict<Module> }) {
		this.all = modules.fold<Import>((acc, { imports }) => acc.merge(imports));
	}

	get local() {
		return this.all.filter(({ resolution }) => resolution && !resolution.isExternal);
	}

	get fullResolved() {
		return this.all.filter(({ resolved }) => Boolean(resolved));
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
		return this.local.filter(({ resolved }) => !resolved);
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
