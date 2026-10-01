import { compileStringAsync } from "sass";

import { LazyAsyncBox } from "~/lib/async.ts";

type Mod = {
	default: string;
};

export const assetsManager = new class {
	#stylesAsyncBox;
	#scriptsAsyncBox;

	constructor() {
		this.#stylesAsyncBox = new LazyAsyncBox(async () => {
			const mod: Mod = await import("./styles.scss", { with: { type: "text" } });
			const { css } = await compileStringAsync(mod.default, { style: "compressed" });
			return css;
		});

		this.#scriptsAsyncBox = new LazyAsyncBox(async () => {
			const mod: Mod = await import("./scripts.js", { with: { type: "text" } });
			return mod.default;
		});
	}

	get scripts() {
		return this.#scriptsAsyncBox.promise;
	}

	get styles() {
		return this.#stylesAsyncBox.promise;
	}
}();
