import type { Event, EventHub, EventListener, EventMap, EventName } from "~/api.d.ts";

export type Pub = {
	send: <K extends EventName>(name: K, ...args: EventMap[K]) => void;
};

const { pub, eventHub } = new class ProgramEvents {
	pub;
	eventHub: EventHub;

	#listeners;
	#events: Event[];

	constructor() {
		this.#events = [];
		this.#listeners = new Set<EventListener>();

		this.pub = {
			send: <K extends EventName>(name: K, ...args: EventMap[K]) => {
				const event = {
					name,
					args,
					timestamp: performance.timeOrigin + performance.now(),
				} as Event;

				this.#listeners.forEach((listener) => {
					listener(event);
				});

				this.#events.push(event);
			},
		};

		const events = this.#events;

		this.eventHub = {
			get events() {
				return events;
			},

			on: (listener: EventListener) => {
				this.#listeners.add(listener);

				return () => {
					this.#listeners.delete(listener);
				};
			},
		};
	}
}();

export { eventHub, pub };
