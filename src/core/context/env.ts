import { assert } from "~/lib/err.ts";
import { shorten, stripEnd } from "~/lib/upath.ts";
import type { ContextEnv } from "~/api.ts";

import type { PathRecProvider } from "../path-rec-provider/index.ts";

export class Env implements ContextEnv {
	basePath;

	#pathRecProvider;

	constructor({ pathRecProvider }: { pathRecProvider: PathRecProvider }) {
		this.#pathRecProvider = pathRecProvider;

		this.basePath = this.#pathRecProvider.basePath;
	}

	getShortPath(path: string) {
		const pathRec = this.#pathRecProvider.findPathRec(path);

		assert(
			pathRec,
			`Can't get the short path for '${path}'. It might be outside the scope '${this.basePath}'.`,
		);

		return shorten(stripEnd(path), this.basePath);
	}
}
