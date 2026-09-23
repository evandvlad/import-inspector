import type { HtmlxComponents } from "~/api.ts";

import { incId, stringifyCompAttrs } from "./helpers.ts";

export const flist: HtmlxComponents["flist"] = (props) => {
	if (!props.items.length) {
		return "";
	}

	const id = incId();

	const items = props.items.map(({ value, content }) => `
		<div data-js-flist-item="${id}" data-js-flist-value="${value}">
			${content}
		</div>
	`).join("");

	return `
		<div ${stringifyCompAttrs({ classes: ["flist"], props })} data-js-flist="${id}">
			<input class="flist__input" type="search" placeholder="..." data-js-flist-input="${id}"/>
			<div class="flist__items">${items}</div>
		</div>
	`;
};
