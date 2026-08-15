type Task = Promise<unknown>;
type AwaitHandler = () => void;

export class AsyncTaskTube {
	#canPass = true;
	#tasks = new Map<string, Task>();
	#awaitHandlers: AwaitHandler[] = [];

	pass(task: Promise<unknown>) {
		const id = crypto.randomUUID();
		this.#tasks.set(id, task);

		task.finally(() => {
			this.#removeTask(id);
		});
	}

	waitForEmpty() {
		const { resolve, promise } = Promise.withResolvers<void>();

		if (!this.#canPass && !this.#tasks.size) {
			resolve();
		} else {
			this.#awaitHandlers.push(resolve);
		}

		return promise;
	}

	close() {
		this.#canPass = false;
	}

	#removeTask(id: string) {
		this.#tasks.delete(id);

		if (!this.#canPass && !this.#tasks.size) {
			this.#awaitHandlers.forEach((handler) => {
				handler();
			});
		}
	}
}
