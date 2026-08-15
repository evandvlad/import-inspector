import type { EventMap } from "./event-map.ts";

type Event = keyof EventMap;
type Listener<T extends Event> = (...args: EventMap[T]) => void;
type Listeners<T extends Event> = Array<Listener<T>>;

export type Pub = {
	send: <T extends Event>(name: T, ...args: EventMap[T]) => void;
};

export type Sub = {
	on: <T extends Event>(name: T, listener: Listener<T>) => () => void;
};

export class PubSub {
	pub: Pub;
	sub: Sub;

	#listeners: { [T in Event]?: Listeners<T> } = Object.create(null);

	constructor() {
		this.pub = {
			send: <T extends Event>(name: T, ...args: EventMap[T]): void => {
				this.#listeners[name]?.forEach((listener) => {
					listener(...args);
				});
			},
		};

		this.sub = {
			on: <T extends Event>(name: T, listener: Listener<T>): () => void => {
				const listeners = this.#listeners[name] ?? [] as Listeners<T>;

				listeners.push(listener);
				(this.#listeners[name] as Listeners<T>) = listeners;

				return () => {
					(this.#listeners[name] as Listeners<T>) = this.#listeners[name]!.filter((list) =>
						listener !== list
					);
				};
			},
		};
	}
}
