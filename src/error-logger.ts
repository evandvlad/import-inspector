import { removeFile, writeFile } from "~/lib/fs.ts";
import { tab } from "~/lib/text.ts";
import { errorLogFilePath } from "~/values.ts";

export class ErrorLogger {
	static async create() {
		await removeFile(errorLogFilePath);
		return new this();
	}

	async log(error: unknown) {
		const content = this.#getContent(error);
		const time = new Date().toISOString();

		await writeFile(errorLogFilePath, `[${time}] ${content}`);
	}

	#getContent(error: unknown) {
		if (Error.isError(error)) {
			const data = {
				name: error.name,
				message: error.message,
				stack: error.stack,
				cause: error.cause,
			};

			return JSON.stringify(data, null, tab);
		}

		return error?.toString() ?? "Unknown error";
	}
}
