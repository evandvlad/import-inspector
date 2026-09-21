import { stringifyAttrs } from "./helpers.ts";

const incId = (() => {
	let id = 0;
	return () => ++id;
})();

export function tabs({ items, attrs }: { items: Array<[key: string, value: string]>; attrs?: Record<string, string> }) {
	const id = incId();

	return `
		<div class="c-tabs" ${stringifyAttrs(attrs)}>
		${
		items.map(([key, value], index) => {
			const name = `tabs-${id}`;
			const tabId = `tabs-tab-${id}-${index}`;

			return `
				<input type="radio" id="${tabId}" name="${name}" ${index === 0 ? "checked" : ""}>
				<label for="${tabId}">${key}</label>
				<div>${value}</div>
			`;
		}).join("")
	}
		</div>
	`;
}
