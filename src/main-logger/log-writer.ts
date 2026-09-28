import { appendToFile, createEmptyFile } from "~/lib/file.ts";
import { withBrBot } from "~/lib/text.ts";
import { mainLogFilePath } from "~/values.ts";
import { LazyAsyncBox } from "~/lib/async.ts";

export class LogWriter {
	#buffer = "";
	#asyncBox;

	static async create() {
		await createEmptyFile(mainLogFilePath);
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
		return withBrBot(`${time} [${name}] ${value ?? ""}`);
	}

	#write(): Promise<void> {
		const content = this.#buffer;
		this.#buffer = "";

		return appendToFile(mainLogFilePath, content).then(() => {
			if (this.#buffer) {
				return this.#write();
			}

			return;
		});
	}
}
