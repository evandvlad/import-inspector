import type { Sub } from "~/lib/pub-sub.ts";
import type { Settings } from "~/settings.ts";
import type { CoreEventMap } from "~/values.ts";

import { AsyncTaskTube } from "../lib/async-task-tube.ts";

import { writeFilePaths } from "./file-paths-writer.ts";
import { writeDynamicImports } from "./dynamic-imports-writer.ts";
import { writeTags } from "./tags-writer.ts";
import { writeFrames } from "./frames-writer.ts";
import { writeDefects } from "./defects-writer.ts";
import { CustomLogWriter } from "./custom-log-writer.ts";

export class Logger {
	#asyncTaskTube;

	constructor({ sub, settings }: { sub: Sub<CoreEventMap>; settings: Settings }) {
		this.#asyncTaskTube = new AsyncTaskTube();

		const logsDir = settings.logsDir!;

		const customLogWriter = new CustomLogWriter({
			logsDir,
			customLoggers: settings.customLoggers,
		});

		sub.on("core:file-path-collecting-finished", (filePaths) => {
			this.#asyncTaskTube.pass(
				writeFilePaths({ logsDir, filePaths }),
			);
		});

		sub.on("core:inspection-finished", (context) => {
			this.#asyncTaskTube.pass(
				writeTags({ logsDir, context }),
			);

			this.#asyncTaskTube.pass(
				writeFrames({ logsDir, context }),
			);

			this.#asyncTaskTube.pass(
				writeDynamicImports({ logsDir, context }),
			);

			this.#asyncTaskTube.pass(
				writeDefects({ logsDir, context }),
			);

			this.#asyncTaskTube.pass(
				customLogWriter.write(context),
			);
		});

		sub.on("core:finished", () => {
			this.#asyncTaskTube.close();
		});
	}

	uponDone() {
		return this.#asyncTaskTube.waitForEmpty();
	}
}
