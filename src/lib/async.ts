export class LazyAsyncBox<T> {
	#job;
	#promise: Promise<T> | null = null;

	constructor(job: () => Promise<T>) {
		this.#job = job;
	}

	get promise() {
		if (!this.#promise) {
			this.#promise = new Promise<T>((resolve, reject) => {
				this.#job().then(resolve, reject);
			});
		}

		return this.#promise;
	}
}
