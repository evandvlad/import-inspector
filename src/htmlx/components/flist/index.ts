import type { HtmlxComponents } from "~/api.ts";

import { decorateComponentOutputOnce, incId, stringifyCompAttrs } from "../helpers.ts";

import script from "./script.js" with { type: "text" };

export const flist = decorateComponentOutputOnce<HtmlxComponents["flist"]>({
	component: (props) => {
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
		<div ${stringifyCompAttrs({ compClass: "c_flist", props })} data-js-flist="${id}">
			<input type="search" placeholder="..." data-js-flist-input="${id}"/>
			<div class="c_flist__items">${items}</div>
		</div>
	`;
	},
	decorator(content) {
		return `${content}<script>${script}</script>`;
	},
});
