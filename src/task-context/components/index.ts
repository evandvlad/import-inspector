import type { AppContext, LineRange, Module, TaskContextComponents } from "~/api.d.ts";
import type { Settings } from "~/settings.ts";

import { createModuleLink } from "./module-link.ts";
import { createModuleCode } from "./module-code.ts";
import { createLintResult } from "./lint-result.ts";
import { createSummary } from "./summary.ts";

export class Components implements TaskContextComponents {
	#appContext;
	#settings;

	constructor({ appContext, settings }: { appContext: AppContext; settings: Settings }) {
		this.#appContext = appContext;
		this.#settings = settings;
	}

	moduleLink(mod: Module, lineRange?: LineRange) {
		return createModuleLink({ mod, lineRange });
	}

	moduleCode(mod: Module, lineRange?: LineRange) {
		return createModuleCode({ mod, lineRange });
	}

	lintResult() {
		return createLintResult({ appContext: this.#appContext });
	}

	summary() {
		return createSummary({ appContext: this.#appContext, settings: this.#settings });
	}
}
