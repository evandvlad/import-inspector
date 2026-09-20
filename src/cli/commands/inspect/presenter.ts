import { Spinner } from "@std/cli/unstable-spinner";

import type { Context } from "~/api.ts";

import { Result } from "./result.ts";
import { createDefectsRepresentation } from "./defects-representation.ts";
import { createSummaryRepresentation } from "./summary-representation.ts";

export class Presenter {
	#timestamp;
	#spinner;

	constructor() {
		this.#timestamp = Date.now();

		this.#spinner = new Spinner({ message: "Processing..." });
		this.#spinner.start();
	}

	summarize({ context }: { context: Context }) {
		const result = new Result({ context });

		this.#spinner.stop();

		if (result.hasDefects) {
			console.error(createDefectsRepresentation({ result }));
		}

		console.log(createSummaryRepresentation({ result, timestamp: this.#timestamp }));

		return result.hasDefects;
	}
}
