import { assert } from "~/lib/err.ts";
import { assertNever } from "~/lib/ts.ts";

type State = "started" | "finished";
type EventName = `${string}:${State}`;

export class Measures {
	#pendingEvents = new Set<string>();
	#readyEvents = new Set<string>();

	setEvent(eventName: EventName) {
		const { baseName, state } = this.#extractInfo(eventName);

		switch (state) {
			case "started": {
				if (this.#pendingEvents.has(baseName)) {
					return;
				}

				this.#pendingEvents.add(baseName);
				performance.mark(eventName);

				return;
			}

			case "finished": {
				if (!this.#pendingEvents.has(baseName)) {
					return;
				}

				performance.mark(eventName);

				this.#pendingEvents.delete(baseName);
				this.#readyEvents.add(baseName);

				return;
			}

			default:
				assertNever(state);
		}
	}

	getItems() {
		return Array.from(this.#readyEvents)
			.map((baseName) => {
				const { startedName, finishedName } = this.#getEventNamesFromBaseName(baseName);
				return performance.measure(baseName, startedName, finishedName);
			})
			.toSorted((a, b) => b.duration - a.duration);
	}

	clear() {
		this.#pendingEvents.clear();
		this.#readyEvents.clear();

		performance.clearMarks();
		performance.clearMeasures();
	}

	#extractInfo(eventName: EventName) {
		const index = eventName.lastIndexOf(":");

		assert(index > 0, `Failed to split event name '${eventName}' into parts.`);

		const baseName = eventName.slice(0, index);
		const state = eventName.slice(index + 1) as State;

		return { baseName, state };
	}

	#getEventNamesFromBaseName(baseName: string) {
		return {
			startedName: `${baseName}:started`,
			finishedName: `${baseName}:finished`,
		};
	}
}
