import type { AppContext, LineRange, Module_v2, TaskContextComponents } from "~/api.ts";
import type { Settings } from "~/settings.ts";

import { createModuleLink } from "./module-link.ts";
import { createModuleCode } from "./module-code.ts";
import { createLintResult } from "./lint-result.ts";
import { createSummary } from "./summary.ts";

export class Components implements TaskContextComponents {
	#appContext;
	#settings;

	constructor(
		{ appContext, settings }: { appContext: AppContext; settings: Settings },
	) {
		this.#appContext = appContext;
		this.#settings = settings;
	}

	moduleLink(mod: Module_v2, lineRange?: LineRange) {
		return createModuleLink({ appContext: this.#appContext, path: mod.path, lineRange });
	}

	moduleCode(mod: Module_v2, lineRange?: LineRange) {
		return createModuleCode({ appContext: this.#appContext, path: mod.path, lineRange });
	}

	lintResult() {
		return createLintResult({ appContext: this.#appContext });
	}

	summary() {
		return createSummary({
			appContext: this.#appContext,
			settings: this.#settings,
		});
	}
}
