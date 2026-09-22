import type { HtmlxComponents } from "~/api.ts";

import { incId, stringifyCompAttrs } from "./helpers.ts";

export const tabs: HtmlxComponents["tabs"] = (props) => {
	if (!props.items.length) {
		return "";
	}

	const id = incId();

	const content = props.items.map(([key, value], index) => {
		const name = `tabs-${id}`;
		const tabId = `tabs-tab-${id}-${index}`;

		return `
			<input class="c_tabs__input" type="radio" id="${tabId}" name="${name}" ${index === 0 ? "checked" : ""}>
			<label class="c_tabs__label" for="${tabId}">${key}</label>
			<div class="c_tabs__content">${value}</div>
		`;
	}).join("");

	return `<div ${stringifyCompAttrs({ compClass: "c_tabs", props })}>${content}</div>`;
};
