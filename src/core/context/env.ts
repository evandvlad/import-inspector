import { assert } from "~/lib/err.ts";
import { shorten, stripEnd } from "~/lib/upath.ts";
import type { ContextEnv } from "~/api.ts";
import type { Settings } from "~/settings.ts";
import { version } from "~/values.ts";
import { components } from "~/htmlx/index.ts";

import type { PathRecProvider } from "../path-rec-provider/index.ts";

export class Env implements ContextEnv {
	preset;
	version;
	basePath;
	htmlxComponents;

	#pathRecProvider;

	constructor({ settings, pathRecProvider }: { settings: Settings; pathRecProvider: PathRecProvider }) {
		this.#pathRecProvider = pathRecProvider;

		this.version = version;
		this.preset = settings.preset;
		this.basePath = this.#pathRecProvider.basePath;
		this.htmlxComponents = components;
	}

	getShortPath(path: string) {
		const pathRec = this.#pathRecProvider.findPathRec(path);

		assert(
			pathRec,
			`Can't get the short path for '${path}'. It might be outside the scope '${this.basePath}'.`,
		);

		return shorten(stripEnd(path), this.basePath);
	}

	getVSCodeUrl(path: string, line?: number) {
		return `vscode://file/${path}${line ? `:${line}` : ""}`;
	}
}
