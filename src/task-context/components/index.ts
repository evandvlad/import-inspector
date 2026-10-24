import type { AppContext, LineRange, Module, TaskContextComponents } from "~/api.d.ts";
import type { Settings } from "~/settings.ts";

import { modPathLink } from "./mod-path-link.ts";
import { modCode } from "./mod-code.ts";
import { lintResult } from "./lint-result.ts";
import { summary } from "./summary.ts";
import { modLinks } from "./mod-links.ts";

export class Components implements TaskContextComponents {
	#appContext;
	#settings;

	constructor({ appContext, settings }: { appContext: AppContext; settings: Settings }) {
		this.#appContext = appContext;
		this.#settings = settings;
	}

	modPathLink(mod: Module, lineRange?: LineRange) {
		return modPathLink({ mod, lineRange });
	}

	modCode(mod: Module, lineRange?: LineRange) {
		return modCode({ mod, lineRange });
	}

	modLinks(mod: Module) {
		return modLinks({ mod });
	}

	lintResult() {
		return lintResult({ appContext: this.#appContext });
	}

	summary() {
		return summary({ appContext: this.#appContext, settings: this.#settings });
	}
}
