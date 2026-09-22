import type { HtmlxComponents } from "~/api.ts";

import { stringifyCompAttrs } from "./helpers.ts";

const incId = (() => {
	let id = 0;
	return () => ++id;
})();

export const tabs: HtmlxComponents["tabs"] = (props) => {
	const id = incId();

	const content = props.items.map(([key, value], index) => {
		const name = `tabs-${id}`;
		const tabId = `tabs-tab-${id}-${index}`;

		return `
			<input type="radio" id="${tabId}" name="${name}" ${index === 0 ? "checked" : ""}>
			<label for="${tabId}">${key}</label>
			<article>${value}</article>
		`;
	}).join("");

	return `<div ${stringifyCompAttrs({ compClass: "c_tabs", props })}>${content}</div>`;
};
