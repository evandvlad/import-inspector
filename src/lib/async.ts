export class LazyAsyncBox<T> {
	#job;
	#promise: Promise<T> | null = null;

	constructor(job: () => Promise<T>) {
		this.#job = job;
	}

	get promise() {
		if (!this.#promise) {
			this.#promise = Promise.try(this.#job);
		}

		return this.#promise;
	}
}
