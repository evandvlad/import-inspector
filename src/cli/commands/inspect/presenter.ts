import { Spinner } from "@std/cli/unstable-spinner";

import type { Config, Context } from "~/core/index.ts";

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

	summarize({ context, config }: { context: Context; config: Config }) {
		const result = new Result({ context });

		this.#spinner.stop();

		if (result.hasDefects) {
			console.error(createDefectsRepresentation({ result }));
		}

		console.log(createSummaryRepresentation({ result, config, timestamp: this.#timestamp }));

		Deno.exit(result.hasDefects ? 1 : 0);
	}
}
