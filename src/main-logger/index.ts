import type { Sub } from "~/lib/pub-sub.ts";
import type { CoreEventMap } from "~/values.ts";

import { LogWriter } from "./log-writer.ts";

type LocalEventMap = {
	"started": [preset: string];
	"config-loaded": [];
	"settings-created": [path: string];
	"finished": [];
};

export class MainLogger {
	#writer;

	static async create() {
		const writer = await LogWriter.create();
		return new this(writer);
	}

	private constructor(writer: LogWriter) {
		this.#writer = writer;
	}

	log<T extends keyof LocalEventMap>(name: T, ...args: LocalEventMap[T]) {
		return this.#writer.write({ name, value: this.#mapLogArgsToValue<T>(name, args) });
	}

	attachCoreSub(sub: Sub<CoreEventMap>) {
		sub.on("core:file-path-collecting-started", () => {
			this.#writer.write({
				name: "core:file-path-collecting-started",
			});
		});

		sub.on("core:file-path-collecting-finished", (filePaths) => {
			this.#writer.write({
				name: "core:file-path-collecting-finished",
				value: `Number: ${filePaths.length}`,
			});
		});

		sub.on("core:files-parsing-started", () => {
			this.#writer.write({
				name: "core:files-parsing-started",
			});
		});

		sub.on("core:files-parser:file-parsed", (filePath) => {
			this.#writer.write({
				name: "core:files-parser:file-parsed",
				value: `File: ${filePath}`,
			});
		});

		sub.on("core:files-parsing-finished", () => {
			this.#writer.write({
				name: "core:files-parsing-finished",
			});
		});

		sub.on("core:modules-building-started", () => {
			this.#writer.write({
				name: "core:modules-building-started",
			});
		});

		sub.on("core:modules-building-finished", (modules) => {
			this.#writer.write({
				name: "core:modules-building-finished",
				value: `Number: ${modules.length}`,
			});
		});

		sub.on("core:packages-building-started", () => {
			this.#writer.write({
				name: "core:packages-building-started",
			});
		});

		sub.on("core:packages-building-finished", (packages) => {
			this.#writer.write({
				name: "core:packages-building-finished",
				value: `Number: ${packages.length}`,
			});
		});

		sub.on("core:tagging-started", () => {
			this.#writer.write({
				name: "core:tagging-started",
			});
		});

		sub.on("core:tagging-finished", () => {
			this.#writer.write({
				name: "core:tagging-finished",
			});
		});

		sub.on("core:inspection-started", () => {
			this.#writer.write({
				name: "core:inspection-started",
			});
		});

		sub.on("core:inspection-finished", () => {
			this.#writer.write({
				name: "core:inspection-finished",
			});
		});

		sub.on("core:finished", () => {
			this.#writer.write({
				name: "core:finished",
			});
		});
	}

	#mapLogArgsToValue<T extends keyof LocalEventMap>(name: T, args: LocalEventMap[T]) {
		switch (name) {
			case "started":
				return `Preset: ${args[0]}`;

			case "settings-created":
				return `Settings path: ${args[0]}`;

			default:
				return undefined;
		}
	}
}
