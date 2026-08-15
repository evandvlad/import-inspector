import { emptyDir } from "@std/fs";

import { Err } from "~/lib/err.ts";

import type { Sub } from "../pub-sub/index.ts";
import type { Config } from "../config.ts";

import { Logger } from "./logger.ts";

export async function createLogger({ sub, config }: { sub: Sub; config: Config }) {
	const { logsDir } = config;

	if (!logsDir) {
		return {
			async uponDone() {},
		} as Logger;
	}

	await emptyDir(logsDir).catch((e) => {
		throw new Err(`There was something wrong with preparing the logs directory for the path '${logsDir}'.`, {
			cause: e,
		});
	});

	return new Logger({ sub, config });
}
