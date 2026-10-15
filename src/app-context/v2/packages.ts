import { DefRefCached } from "~/lib/ref.ts";
import type { AppContextPackages_v2, Dict, Package_v2 } from "~/api.ts";

import { PathableEntities } from "./pathable-entities.ts";

export class Packages extends PathableEntities<Package_v2> implements AppContextPackages_v2 {
	#rootsRef;

	constructor({ dict }: { dict: Dict<Package_v2> }) {
		super({ dict });

		this.#rootsRef = new DefRefCached(() =>
			new PathableEntities({ dict: dict.filter(({ hasParent }) => !hasParent) })
		);
	}

	get roots() {
		return this.#rootsRef.value;
	}
}
