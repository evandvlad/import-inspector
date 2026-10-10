import { assert } from "~/lib/err.ts";
import { concat, shorten, stripEnd } from "~/lib/upath.ts";
import type { AppContextEnv } from "~/api.ts";
import type { Settings } from "~/settings.ts";
import { version } from "~/values.ts";
import { components } from "~/htmlx/index.ts";

import type { PathRecProvider } from "./path-rec-provider/index.ts";

export class Env implements AppContextEnv {
	preset;
	version;
	basePath;
	htmlxc;

	#pathRecProvider;

	constructor({ settings, pathRecProvider }: { settings: Settings; pathRecProvider: PathRecProvider }) {
		this.#pathRecProvider = pathRecProvider;

		this.version = version;
		this.preset = settings.preset;
		this.basePath = this.#pathRecProvider.basePath;
		this.htmlxc = components;
	}

	shortPath(path: string) {
		const pathRec = this.#pathRecProvider.findPathRec(path);

		assert(
			pathRec,
			`Can't get short path for '${path}'. It might be outside scope '${this.basePath}'.`,
		);

		return shorten(stripEnd(path), this.basePath);
	}

	fullPath(path: string) {
		const fullPath = this.findFullPath(path);
		assert(fullPath, `Can't get full path for '${path}.' It might be outside scope '${this.basePath}'.`);
		return fullPath;
	}

	findFullPath(path: string) {
		const fullPath = path.startsWith(this.basePath) ? path : concat([this.basePath, path]);
		const pathRec = this.#pathRecProvider.findPathRec(fullPath);
		return pathRec ? fullPath : null;
	}

	editorUrl(path: string, line?: number) {
		return `vscode://file/${path}${line ? `:${line}` : ""}`;
	}
}
