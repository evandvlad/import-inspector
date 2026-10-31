type Rec = Record<string, unknown[]>;

type Event<T extends Rec> = { [K in keyof T]: { name: K; args: T[K] } }[keyof T];
type Listener<T extends Rec> = (event: Event<T>) => void;
type EventListener<T extends unknown[]> = (...args: T) => void;

export type Pub<T extends Rec> = {
	send: <K extends keyof T>(name: K, ...args: T[K]) => void;
};

export type Sub<T extends Rec> = {
	on: <K extends keyof T>(name: K, listener: EventListener<T[K]>) => () => void;
	onAll: (listener: Listener<T>) => () => void;
};

export class PubSub<T extends Rec> {
	pub: Pub<T>;
	sub: Sub<T>;

	#listeners = new Set<Listener<T>>();

	constructor() {
		this.pub = {
			send: <K extends keyof T>(name: K, ...args: T[K]) => {
				this.#listeners.forEach((listener) => {
					listener({ name, args });
				});
			},
		};

		this.sub = {
			on: <K extends keyof T>(name: K, listener: EventListener<T[K]>) => {
				const fn: Listener<T> = (event) => {
					if (name === event.name) {
						listener(...event.args as T[K]);
					}
				};

				this.#listeners.add(fn);

				return () => {
					this.#listeners.delete(fn);
				};
			},

			onAll: (listener: Listener<T>) => {
				this.#listeners.add(listener);

				return () => {
					this.#listeners.delete(listener);
				};
			},
		};
	}
}
