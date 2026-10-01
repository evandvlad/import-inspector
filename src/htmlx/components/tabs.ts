import type { HtmlxComponents } from "~/api.ts";

import { incId, stringifyCompAttrs } from "../helpers.ts";

export const tabs: HtmlxComponents["tabs"] = (props) => {
	const { items } = props;

	if (items.length === 0) {
		return "";
	}

	const id = incId();
	const attrs = { "data-js-tabs": id.toString() };

	const links = `
		<div class="tabs__links">
			${items.map(({ label }) => `<div class="tabs__link" data-js-tabs-link="${id}">${label}</div>`).join("")}
		</div>
	`;

	const contents = items.map(({ value }) => `
		<div class="tabs__content" data-js-tabs-content="${id}">
			${value}
		</div>
	`).join("");

	return `
		<div ${stringifyCompAttrs({ classes: ["tabs"], attrs, props })}>
			${links}
			${contents}
		</div>
	`;
};
