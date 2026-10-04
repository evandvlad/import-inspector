import type { AppContext, LineRange, TaskContextComponents } from "~/api.ts";
import type { Settings } from "~/settings.ts";

import { createCode } from "./code.ts";
import { createLintResult } from "./lint-result.ts";
import { createSummary } from "./summary.ts";

export class Components implements TaskContextComponents {
	#appContext;
	#settings;
	#startedAt;

	constructor(
		{ appContext, settings, startedAt }: { appContext: AppContext; settings: Settings; startedAt: number },
	) {
		this.#appContext = appContext;
		this.#settings = settings;
		this.#startedAt = startedAt;
	}

	code(path: string, lineRange?: LineRange) {
		return createCode({ appContext: this.#appContext, path, lineRange });
	}

	lintResult() {
		return createLintResult({ appContext: this.#appContext });
	}

	summary() {
		return createSummary({
			appContext: this.#appContext,
			settings: this.#settings,
			startedAt: this.#startedAt,
		});
	}
}
