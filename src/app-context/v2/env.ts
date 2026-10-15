import { assert } from "~/lib/err.ts";
import type { AppContextEnv_v2, Dict, Module_v2 } from "~/api.ts";
import type { Settings } from "~/settings.ts";
import { version } from "~/values.ts";
import { components } from "~/htmlx/index.ts";

export class Env implements AppContextEnv_v2 {
	preset;
	version;
	basePath;
	htmlxc;

	#modDict;

	constructor({ basePath, settings, modDict }: { basePath: string; settings: Settings; modDict: Dict<Module_v2> }) {
		this.basePath = basePath;
		this.version = version;
		this.htmlxc = components;
		this.preset = settings.preset;

		this.#modDict = modDict;
	}

	toFullPath(pathOrShortPath: string) {
		if (this.#modDict.has(pathOrShortPath)) {
			return pathOrShortPath;
		}

		const mod = this.#modDict.find(({ shortPath }) => shortPath === pathOrShortPath);
		assert(mod, `Can't get full path for '${pathOrShortPath}.' It might be outside scope '${this.basePath}'.`);

		return mod.path;
	}

	editorUrl(path: string, line?: number) {
		return `vscode://file/${path}${line ? `:${line}` : ""}`;
	}
}
