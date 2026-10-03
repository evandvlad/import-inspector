import { spin } from "~/lib/cli-view.ts";
import type { AppContext } from "~/api.ts";
import type { Settings } from "~/settings.ts";

import { Result } from "./result.ts";
import { createDefectsRepresentation } from "./defects-representation.ts";
import { createSummaryRepresentation } from "./summary-representation.ts";

export class LintOutput {
	#timestamp;
	#spinner;

	constructor() {
		this.#timestamp = Date.now();
		this.#spinner = spin({ message: "Processing..." });
	}

	summarize({ appContext, settings }: { appContext: AppContext; settings: Settings }) {
		const result = new Result({ appContext, settings });

		this.#spinner.stop();

		if (result.hasDefects) {
			console.error(createDefectsRepresentation({ result }));
		}

		console.log(createSummaryRepresentation({ result, timestamp: this.#timestamp }));

		return result.hasDefects;
	}
}
