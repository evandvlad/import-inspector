import { DefRefCached } from "~/lib/ref.ts";
import type { AppContextPackages, Dict, Package } from "~/api.ts";

import { PathableEntities } from "./pathable-entities.ts";

export class Packages extends PathableEntities<Package> implements AppContextPackages {
	#rootsRef;

	constructor({ dict }: { dict: Dict<Package> }) {
		super({ dict });

		this.#rootsRef = new DefRefCached(() =>
			new PathableEntities({ dict: dict.filter(({ hasParent }) => !hasParent) })
		);
	}

	get roots() {
		return this.#rootsRef.value;
	}
}
