import type { AppContextPackages, Dict, Package } from "~/api.d.ts";

import { cache } from "./tag-based-cache.ts";

export class ContextPackages implements AppContextPackages {
	all;

	constructor({ dict }: { dict: Dict<Package> }) {
		this.all = dict;
	}

	@cache()
	get roots() {
		return this.all.filter(({ hasParent }) => !hasParent);
	}
}
