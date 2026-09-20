import { rethrowErr } from "~/lib/err.ts";
import { mainLogFilePath } from "~/env.ts";

class Lock {
	#resolvers: Array<() => void> = [];

	promise() {
		const { promise, resolve } = Promise.withResolvers<void>();
		this.#resolvers.push(resolve);
		return promise;
	}

	release() {
		this.#resolvers.forEach((resolver) => {
			resolver();
		});
	}
}

export class LogWriter {
	#buffer = "";
	#lock: Lock | null = null;

	static async create() {
		await Deno.create(mainLogFilePath).catch(
			rethrowErr(`Can't create the file '${mainLogFilePath}'.`),
		);

		return new this();
	}

	private constructor() {}

	async write(params: { name: string; value?: string }) {
		this.#buffer += this.#createLine(params);
		await this.#run();
	}

	async #run() {
		if (this.#lock) {
			return this.#lock.promise();
		}

		this.#lock = new Lock();

		const content = this.#buffer;
		this.#buffer = "";

		try {
			await this.#write(content);
		} finally {
			this.#lock.release();
			this.#lock = null;
		}

		if (this.#buffer) {
			await this.#run();
		}
	}

	#createLine({ name, value }: { name: string; value?: string }) {
		const time = new Date().toISOString();
		return `${time} [${name}] ${value ?? ""}\n`;
	}

	async #write(content: string) {
		await Deno.writeTextFile(mainLogFilePath, content, { append: true }).catch(
			rethrowErr(`An error occurred while writing to the file '${mainLogFilePath}'.`),
		);
	}
}
