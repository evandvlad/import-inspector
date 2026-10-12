export class DefRef<T> {
	#resolve;

	constructor(resolve: () => T) {
		this.#resolve = resolve;
	}

	get value() {
		return this.#resolve();
	}
}

export class DefRefCached<T> extends DefRef<T> {
	#value?: T;
	#isResolved = false;

	override get value() {
		if (!this.#isResolved) {
			this.#value = super.value;
			this.#isResolved = true;
		}

		return this.#value as T;
	}

	clear() {
		this.#isResolved = false;
	}
}
