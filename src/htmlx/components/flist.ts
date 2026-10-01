import type { HtmlxComponents } from "~/api.ts";

import { incId, stringifyCompAttrs } from "../helpers.ts";

export const flist: HtmlxComponents["flist"] = (props) => {
	const { items } = props;

	if (items.length === 0) {
		return "";
	}

	const id = incId();

	const content = items.map(({ value, content }) => `
		<div data-js-flist-item="${id}" data-js-flist-value="${value}">
			${content}
		</div>
	`).join("");

	return `
		<div ${stringifyCompAttrs({ classes: ["flist"], props })} data-js-flist="${id}">
			<div class="flist__bar">
				<input class="flist__input" type="search" placeholder="..." data-js-flist-input="${id}"/>
				<div class="flist__counter" data-js-flist-counter="${id}">${items.length}</div>
			</div>
			<div class="flist__items">${content}</div>
		</div>
	`;
};
