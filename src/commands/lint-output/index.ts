import { spin } from "~/lib/cli-view.ts";
import type { Context } from "~/api.ts";
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

	summarize({ context, settings }: { context: Context; settings: Settings }) {
		const result = new Result({ context, settings });

		this.#spinner.stop();

		if (result.hasDefects) {
			console.error(createDefectsRepresentation({ result }));
		}

		console.log(createSummaryRepresentation({ result, timestamp: this.#timestamp }));

		return result.hasDefects;
	}
}
