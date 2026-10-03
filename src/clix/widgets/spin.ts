import { Spinner } from "@std/cli/unstable-spinner";

import type { ClixWidgets } from "~/api.ts";

export const spin: ClixWidgets["spin"] = (message) => {
	const spinner = new Spinner({ message });
	let isStopped = false;

	spinner.start();

	return {
		stop() {
			if (isStopped) {
				return;
			}

			isStopped = true;

			spinner.stop();
		},
	};
};
