import { AsyncTaskTube } from "../lib/async-task-tube.ts";
import type { Sub } from "../pub-sub/index.ts";
import type { Config } from "../config.ts";

import { MainLogWriter } from "./main-log-writer.ts";
import { writeFilePaths } from "./file-paths-writer.ts";
import { writeDynamicImports } from "./dynamic-imports-writer.ts";
import { writeTags } from "./tags-writer.ts";
import { writeFrames } from "./frames-writer.ts";
import { writeDefects } from "./defects-writer.ts";
import { CustomLogWriter } from "./custom-log-writer.ts";

export class Logger {
	#asyncTaskTube;

	constructor({ sub, config }: { sub: Sub; config: Config }) {
		this.#asyncTaskTube = new AsyncTaskTube();

		const logsDir = config.logsDir!;

		const customLogWriter = new CustomLogWriter({
			logsDir,
			customLoggers: config.customLoggers,
		});

		const mainLogWriter = new MainLogWriter({ logsDir });

		sub.on("main:config-created", () => {
			this.#asyncTaskTube.pass(
				mainLogWriter.write({
					eventName: "main:config-created",
				}),
			);
		});

		sub.on("main:file-path-collecting-started", () => {
			this.#asyncTaskTube.pass(
				mainLogWriter.write({
					eventName: "main:file-path-collecting-started",
				}),
			);
		});

		sub.on("main:file-path-collecting-finished", (filePaths) => {
			this.#asyncTaskTube.pass(
				mainLogWriter.write({
					eventName: "main:file-path-collecting-finished",
				}),
			);

			this.#asyncTaskTube.pass(
				writeFilePaths({ logsDir, filePaths }),
			);
		});

		sub.on("main:files-parsing-started", () => {
			this.#asyncTaskTube.pass(
				mainLogWriter.write({
					eventName: "main:files-parsing-started",
				}),
			);
		});

		sub.on("files-parser:file-parsed", (filePath) => {
			this.#asyncTaskTube.pass(
				mainLogWriter.write({
					eventName: "files-parser:file-parsed",
					value: `File: ${filePath}`,
				}),
			);
		});

		sub.on("main:files-parsing-finished", () => {
			this.#asyncTaskTube.pass(
				mainLogWriter.write({
					eventName: "main:files-parsing-finished",
				}),
			);
		});

		sub.on("main:modules-building-started", () => {
			this.#asyncTaskTube.pass(
				mainLogWriter.write({
					eventName: "main:modules-building-started",
				}),
			);
		});

		sub.on("main:modules-building-finished", (modules) => {
			this.#asyncTaskTube.pass(
				mainLogWriter.write({
					eventName: "main:modules-building-finished",
					value: `Count: ${modules.length}`,
				}),
			);
		});

		sub.on("main:packages-building-started", () => {
			this.#asyncTaskTube.pass(
				mainLogWriter.write({
					eventName: "main:packages-building-started",
				}),
			);
		});

		sub.on("main:packages-building-finished", (packages) => {
			this.#asyncTaskTube.pass(
				mainLogWriter.write({
					eventName: "main:packages-building-finished",
					value: `Count: ${packages.length}`,
				}),
			);
		});

		sub.on("main:tagging-started", () => {
			this.#asyncTaskTube.pass(
				mainLogWriter.write({
					eventName: "main:tagging-started",
				}),
			);
		});

		sub.on("main:tagging-finished", () => {
			this.#asyncTaskTube.pass(
				mainLogWriter.write({
					eventName: "main:tagging-finished",
				}),
			);
		});

		sub.on("main:inspection-started", () => {
			this.#asyncTaskTube.pass(
				mainLogWriter.write({
					eventName: "main:inspection-started",
				}),
			);
		});

		sub.on("main:inspection-finished", (context) => {
			this.#asyncTaskTube.pass(
				mainLogWriter.write({
					eventName: "main:inspection-finished",
				}),
			);

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

		sub.on("main:finished", () => {
			this.#asyncTaskTube.pass(
				mainLogWriter.write({
					eventName: "main:finished",
				}),
			);

			this.#asyncTaskTube.close();
		});
	}

	uponDone() {
		return this.#asyncTaskTube.waitForEmpty();
	}
}
