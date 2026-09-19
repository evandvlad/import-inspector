import { emptyDir } from "@std/fs";

import { rethrowErr } from "~/lib/err.ts";
import type { Settings } from "~/settings.ts";

import type { Sub } from "../pub-sub/index.ts";

import { Logger } from "./logger.ts";

export async function createLogger({ sub, settings }: { sub: Sub; settings: Settings }) {
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
