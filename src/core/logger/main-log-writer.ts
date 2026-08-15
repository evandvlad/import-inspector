import { join } from "../lib/path.ts";

import { writeToFile } from "./helpers.ts";
import { LogFileName } from "./values.ts";

export class MainLogWriter {
	#path;
	#buffer = "";
	#isBusy = false;

	constructor({ logsDir }: { logsDir: string }) {
		this.#path = join(logsDir, LogFileName.Main);
	}

	async write(params: { eventName: string; value?: string }) {
		this.#buffer += this.#createLine(params);
		await this.#run();
	}

	async #run() {
		if (this.#isBusy) {
			return Promise.resolve();
		}

		this.#isBusy = true;

		const content = this.#buffer;
		this.#buffer = "";

		try {
			await this.#write(content);
		} finally {
			this.#isBusy = false;
		}

		if (this.#buffer) {
			await this.#run();
		}
	}

	#createLine({ eventName, value }: { eventName: string; value?: string }) {
		const time = new Date().toISOString();
		return `${time} [${eventName}] ${value ?? ""}\n`;
	}

	async #write(content: string) {
		await writeToFile({ path: this.#path, content, append: true });
	}
}
