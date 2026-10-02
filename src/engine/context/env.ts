import { assert } from "~/lib/err.ts";
import { assertNever } from "~/lib/ts.ts";
import { shorten, stripEnd } from "~/lib/upath.ts";
import type { ContextEnv, Json, ViewDataMode } from "~/api.ts";
import type { Settings } from "~/settings.ts";
import { version } from "~/values.ts";
import { components, createHtml } from "~/htmlx/index.ts";

import type { PathRecProvider } from "../path-rec-provider/index.ts";

export class Env implements ContextEnv {
	htmlx;
	preset;
	version;
	basePath;

	#pathRecProvider;

	constructor({ settings, pathRecProvider }: { settings: Settings; pathRecProvider: PathRecProvider }) {
		this.#pathRecProvider = pathRecProvider;

		this.version = version;
		this.preset = settings.preset;
		this.basePath = this.#pathRecProvider.basePath;

		this.htmlx = {
			createHtml,
			components,
		};
	}

	getShortPath(path: string) {
		const pathRec = this.#pathRecProvider.findPathRec(path);

		assert(
			pathRec,
			`Can't get short path for '${path}'. It might be outside scope '${this.basePath}'.`,
		);

		return shorten(stripEnd(path), this.basePath);
	}

	getEditorUrl(path: string, line?: number) {
		return `vscode://file/${path}${line ? `:${line}` : ""}`;
	}

	toViewData(mode: ViewDataMode = "brief"): Json {
		switch (mode) {
			case "minimal":
			case "brief":
				return this.#toMinimalViewData();

			case "verbose":
				return {
					...this.#toMinimalViewData(),
					version: this.version,
					preset: this.preset,
				};

			default:
				assertNever(mode);
		}
	}

	#toMinimalViewData() {
		return {
			basePath: this.basePath,
		};
	}
}
