import { assert } from "~/lib/err.ts";
import { Dict } from "~/lib/dict.ts";
import { DefRefCached } from "~/lib/ref.ts";
import type { Dict as IDict, Import_v2, Imports_v2, ReadonlyDict } from "~/api.ts";

export class Imports implements Imports_v2 {
	total;
	ids;
	byId;

	#localByIdRef;
	#fullResolvedByIdRef;
	#fullUnresolvedByIdRef;
	#localUnresolvedByIdRef;
	#dynamicByIdRef;
	#staticByIdRef;
	#externalByIdRef;
	#externalByLocatorRef;

	constructor({ dict }: { dict: IDict<Import_v2> }) {
		this.total = dict.size;
		this.ids = dict.toKeys();
		this.byId = dict;

		this.#localByIdRef = new DefRefCached(() =>
			dict.filter(({ resolution }) => resolution && !resolution.isExternal)
		);

		this.#fullResolvedByIdRef = new DefRefCached(() => dict.filter(({ resolution }) => Boolean(resolution?.mod)));

		this.#fullUnresolvedByIdRef = new DefRefCached(() =>
			dict.filter(({ locator, isDynamic, resolution }) => {
				if (!locator) {
					return true;
				}

				return isDynamic && resolution && !resolution.isExternal && !resolution.mod;
			})
		);

		this.#localUnresolvedByIdRef = new DefRefCached(() => dict.filter(({ resolution }) => !resolution));
		this.#dynamicByIdRef = new DefRefCached(() => dict.filter(({ isDynamic }) => isDynamic));
		this.#staticByIdRef = new DefRefCached(() => dict.filter(({ isDynamic }) => !isDynamic));

		this.#externalByIdRef = new DefRefCached(() =>
			dict.filter(({ resolution }) => resolution && resolution.isExternal)
		);

		this.#externalByLocatorRef = new DefRefCached(() =>
			this.#externalByIdRef.value
				.group(({ locator }) => String(locator))
				.sortK((a, b) => a.localeCompare(b))
				.map<ReadonlyDict<Import_v2>>((imports) => Dict.fromArray(imports, ({ id }) => id))
		);
	}

	get localById() {
		return this.#localByIdRef.value;
	}

	get fullResolvedById() {
		return this.#fullResolvedByIdRef.value;
	}

	get fullUnresolvedById() {
		return this.#fullUnresolvedByIdRef.value;
	}

	get localUnresolvedById() {
		return this.#localUnresolvedByIdRef.value;
	}

	get dynamicById() {
		return this.#dynamicByIdRef.value;
	}

	get staticById() {
		return this.#staticByIdRef.value;
	}

	get externalById() {
		return this.#externalByIdRef.value;
	}

	get externalByLocator() {
		return this.#externalByLocatorRef.value;
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
}
