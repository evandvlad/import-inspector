import { concat, isAbsolute, shorten, unify } from "~/lib/upath.ts";
import type { AppContextEnv_v2 } from "~/api.ts";
import type { Settings } from "~/settings.ts";
import { version } from "~/values.ts";
import { components } from "~/htmlx/index.ts";

export class Env implements AppContextEnv_v2 {
	preset;
	version;
	basePath;
	htmlxc;

	constructor({ basePath, settings }: { basePath: string; settings: Settings }) {
		this.basePath = basePath;
		this.version = version;
		this.htmlxc = components;
		this.preset = settings.preset;
	}

	toShortPath(pathOrShortPath: string) {
		const path = unify(pathOrShortPath);

		if (!isAbsolute(path)) {
			return path;
		}

		return shorten(path, this.basePath);
	}

	toFullPath(pathOrShortPath: string) {
		const path = unify(pathOrShortPath);

		if (isAbsolute(path)) {
			return path;
		}

		return concat([this.basePath, path]);
	}

	editorUrl(path: string, line?: number) {
		return `vscode://file/${path}${line ? `:${line}` : ""}`;
	}
}
