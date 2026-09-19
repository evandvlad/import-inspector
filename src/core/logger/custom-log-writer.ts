import { ensureDir } from "@std/fs";

import { Err, isErr } from "~/lib/err.ts";
import { join } from "~/lib/upath.ts";
import { assertNever } from "~/lib/ts.ts";
import type { CustomLogger } from "~/api.ts";

import { formatJson, formatYaml } from "../lib/format.ts";
import type { Context } from "../context/index.ts";

import { writeToFile } from "./helpers.ts";
import { customLoggersDirName } from "./values.ts";

export class CustomLogWriter {
	#logsDir;
	#customLoggers;

	constructor({ logsDir, customLoggers }: { logsDir: string; customLoggers: CustomLogger[] }) {
		this.#logsDir = join(logsDir, customLoggersDirName);
		this.#customLoggers = customLoggers;
	}

	async write(context: Context) {
		await ensureDir(this.#logsDir).catch((e) => {
			throw new Err(
				`There was something wrong with preparing the custom logs directory for the path '${this.#logsDir}'.`,
				{ cause: e },
			);
		});

		await Promise.all(
			this.#customLoggers.map((customLogger) => this.#writeLog({ context, customLogger })),
		);
	}

	async #writeLog({ customLogger, context }: { customLogger: CustomLogger; context: Context }) {
		const { name, format } = customLogger;
		const path = join(this.#logsDir, [name, format].join("."));

		try {
			const content = await this.#getContent({ customLogger, context });
			await writeToFile({ path, content });
		} catch (e) {
			if (isErr(e)) {
				throw e;
			}

			throw new Err(`An error occurred while writing into the custom log '${path}'.`, { cause: e });
		}
	}

	async #getContent({ customLogger, context }: { customLogger: CustomLogger; context: Context }) {
		try {
			const { format } = customLogger;
			const data = await customLogger.provide(context);

			switch (format) {
				case "yaml":
					// deno-lint-ignore no-explicit-any
					return formatYaml(data as any);

				case "json":
					// deno-lint-ignore no-explicit-any
					return formatJson(data as any);

				case "log":
				case "md":
					return data?.toString() ?? "";

				default:
					assertNever(format);
			}
		} catch (e) {
			throw new Err("An error occurred while preparing data for the custom logger.", { cause: e });
		}
	}
}
