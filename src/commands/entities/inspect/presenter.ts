import { withBrBoth, withBrTop } from "~/lib/text.ts";
import { spin } from "~/lib/cli-view.ts";
import type { Context } from "~/api.ts";
import type { Settings } from "~/settings.ts";

import { Result } from "./result.ts";
import { createDefectsRepresentation } from "./defects-representation.ts";
import { createSummaryRepresentation } from "./summary-representation.ts";

export class Presenter {
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
			console.error(withBrTop(createDefectsRepresentation({ result })));
		}

		console.log(withBrBoth(createSummaryRepresentation({ result, timestamp: this.#timestamp })));

		return result.hasDefects;
	}
}
