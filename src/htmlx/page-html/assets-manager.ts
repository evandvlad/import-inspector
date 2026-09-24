import sass from "sass";

import scssStyles from "./styles.scss" with { type: "text" };
import scripts from "./scripts.js" with { type: "text" };

export const assetsManager = new class {
	scripts = scripts;

	#styles: string | null = null;

	get styles() {
		if (this.#styles !== null) {
			return this.#styles;
		}

		const compiledStyles = sass(scssStyles).to_string();
		this.#styles = typeof compiledStyles === "string" ? compiledStyles : "";

		return this.#styles;
	}
}();
