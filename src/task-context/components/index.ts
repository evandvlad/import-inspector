import type { AppContext, LineRange, Module, TaskContextComponents } from "~/api.d.ts";
import type { Settings } from "~/settings.ts";

import { modPathLink } from "./mod-path-link.ts";
import { modInfo } from "./mod-info.ts";
import { modLinks } from "./mod-links.ts";
import { modCode } from "./mod-code.ts";
import { modDefects } from "./mod-defects.ts";
import { lintResult } from "./lint-result.ts";
import { summary } from "./summary.ts";

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

	modInfo(mod: Module) {
		return modInfo({ mod });
	}

	modCode(mod: Module, lineRange?: LineRange) {
		return modCode({ mod, lineRange });
	}

	modLinks(mod: Module) {
		return modLinks({ mod });
	}

	modDefects(mod: Module) {
		return modDefects({ mod });
	}

	lintResult() {
		return lintResult({ appContext: this.#appContext });
	}

	summary() {
		return summary({ appContext: this.#appContext, settings: this.#settings });
	}
}
