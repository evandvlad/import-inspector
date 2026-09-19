import { ensureFile } from "@std/fs";

import { remapErr, rethrowErr } from "~/lib/err.ts";
import { mainLogFilePath } from "~/values.ts";
import { LazyAsyncBox } from "~/lib/async.ts";

export class LogWriter {
	#buffer = "";
	#asyncBox;

	static async create() {
		try {
			await ensureFile(mainLogFilePath);
			await Deno.create(mainLogFilePath);
		} catch (e) {
			remapErr(e, `Can't create the file '${mainLogFilePath}'.`);
		}

		return new this();
	}

	private constructor() {
		this.#asyncBox = this.#createAsyncBox();
	}

	write(params: { name: string; value?: string }) {
		this.#buffer += this.#createLine(params);
		return this.#asyncBox.promise;
	}

	#createAsyncBox(): LazyAsyncBox<void> {
		return new LazyAsyncBox(async () => {
			await this.#write();
			this.#asyncBox = this.#createAsyncBox();
		});
	}

	#createLine({ name, value }: { name: string; value?: string }) {
		const time = new Date().toISOString();
		return `${time} [${name}] ${value ?? ""}\n`;
	}

	#write(): Promise<void> {
		const content = this.#buffer;
		this.#buffer = "";

		return this.#writeToFile(content).then(() => {
			if (this.#buffer) {
				return this.#write();
			}

			return;
		});
	}

	async #writeToFile(content: string) {
		await Deno.writeTextFile(mainLogFilePath, content, { append: true }).catch(
			rethrowErr(`An error occurred while writing to the file '${mainLogFilePath}'.`),
		);
	}
}
