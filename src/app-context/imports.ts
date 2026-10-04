import { assert } from "~/lib/err.ts";
import type { Dict as IDict, Import, Imports as IImports, Module } from "~/api.ts";
import { Dict } from "~/lib/dict.ts";

import { cache } from "./tag-based-cache.ts";

export class Imports implements IImports {
	size;
	ids;
	byId;

	constructor({ dict }: { dict: IDict<Import> }) {
		this.size = dict.size;
		this.ids = dict.toKeys();
		this.byId = dict;
	}

	@cache()
	get localById() {
		return this.byId.filter(({ resolution }) => resolution && !resolution.isExternal);
	}

	@cache()
	get fullResolvedById() {
		return this.byId.filter(({ importedMod }) => importedMod);
	}

	@cache()
	get fullUnresolvedById() {
		return this.byId.filter(({ locator, isDynamic, resolution }) => {
			if (!locator) {
				return true;
			}

			return isDynamic && resolution && !resolution.isExternal && !resolution.mod;
		});
	}

	@cache()
	get localUnresolvedById() {
		return this.localById.filter(({ resolution }) => !resolution!.mod);
	}

	@cache()
	get localUnresolvedByLocator() {
		return this.#mapByLocator(this.localUnresolvedById);
	}

	@cache()
	get dynamicById() {
		return this.byId.filter(({ isDynamic }) => isDynamic);
	}

	@cache()
	get staticById() {
		return this.byId.filter(({ isDynamic }) => !isDynamic);
	}

	@cache()
	get externalById() {
		return this.byId.filter(({ resolution }) => resolution && resolution.isExternal);
	}

	@cache()
	get externalByLocator() {
		return this.#mapByLocator(this.externalById);
	}

	has(id: string) {
		return this.byId.has(id);
	}

	get(id: string) {
		const imp = this.find(id);
		assert(imp, `Can't get import by id '${id}'.`);
		return imp;
	}

	find(id: string) {
		return this.byId.getOrDefault(id, null);
	}

	hasForMod(mod: Module) {
		return this.fullResolvedById.some(({ importedMod }) => importedMod === mod);
	}

	getForMod(mod: Module) {
		return this.fullResolvedById.filter(({ importedMod }) => importedMod === mod);
	}

	findForMod(mod: Module) {
		return this.fullResolvedById.find(({ importedMod }) => importedMod === mod) ?? null;
	}

	#mapByLocator(dict: IDict<Import>) {
		return dict.group(({ locator }) => String(locator))
			.sortK((a, b) => a.localeCompare(b))
			.map<IDict<Import>>((arr) => Dict.fromArray(arr, ({ id }) => id));
	}
}
