type Rec = Record<string, unknown[]>;
type Listener<T extends unknown[]> = (...args: T) => void;

export type Pub<T extends Rec> = {
	send: <K extends keyof T>(name: K, ...args: T[K]) => void;
};

export type Sub<T extends Rec> = {
	on: <K extends keyof T>(name: K, listener: Listener<T[K]>) => () => void;
};

export class PubSub<T extends Rec> {
	pub: Pub<T>;
	sub: Sub<T>;

	#listeners: { [U in keyof T]?: Listener<T[U]>[] } = Object.create(null);

	constructor() {
		this.pub = {
			send: <K extends keyof T>(name: K, ...args: T[K]) => {
				this.#listeners[name]?.forEach((listener) => {
					listener(...args);
				});
			},
		};

		this.sub = {
			on: <K extends keyof T>(name: K, listener: Listener<T[K]>) => {
				this.#listeners[name] = this.#listeners[name] ?? [];
				this.#listeners[name].push(listener);

				return () => {
					this.#listeners[name] = this.#listeners[name]!.filter((list) => listener !== list);
				};
			},
		};
	}
}
