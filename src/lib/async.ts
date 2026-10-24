import type { MaybePromise, Nullable } from "~/lib/ts.ts";

export class LazyAsyncBox<T> {
	#fn;
	#promise: Nullable<Promise<T>> = null;

	constructor(fn: () => Promise<T>) {
		this.#fn = fn;
	}

	get promise() {
		if (!this.#promise) {
			this.#promise = Promise.try(this.#fn);
		}

		return this.#promise;
	}
}

export async function loop(fn: () => MaybePromise<boolean>) {
	const isDone = await fn();

	if (!isDone) {
		await loop(fn);
	}
}
