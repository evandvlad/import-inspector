import { emptyDir } from "@std/fs";

import { rethrowErr } from "~/lib/err.ts";
import type { Sub } from "~/lib/pub-sub.ts";
import type { Settings } from "~/settings.ts";
import type { CoreEventMap } from "~/values.ts";

import { Logger } from "./logger.ts";

export async function createLogger({ sub, settings }: { sub: Sub<CoreEventMap>; settings: Settings }) {
	const { logsDir } = settings;

	if (!logsDir) {
		return {
			async uponDone() {},
		} as Logger;
	}

	await emptyDir(logsDir).catch(
		rethrowErr(`There was something wrong with preparing the logs directory for the path '${logsDir}'.`),
	);

	return new Logger({ sub, settings });
}
