import type { AppContextPacks, Dict, Pack } from "~/api.d.ts";

import { cache } from "./tag-based-cache.ts";

export class ContextPacks implements AppContextPacks {
	all;

	constructor({ dict }: { dict: Dict<Pack> }) {
		this.all = dict;
	}

	@cache()
	get roots() {
		return this.all.filter(({ hasParent }) => !hasParent);
	}
}
