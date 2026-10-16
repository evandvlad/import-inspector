import type { Dict, Import_v1, Imports_v1, Module_v1 } from "~/api.ts";

export class Imports implements Imports_v1 {
	all;

	constructor({ modules }: { modules: Dict<Module_v1> }) {
		this.all = modules.fold<Import_v1>((acc, { imports }) => acc.merge(imports));
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
