import type { HtmlxComponents } from "~/api.ts";

import { stringifyCompAttrs } from "../helpers.ts";

export const cols: HtmlxComponents["cols"] = (items, options = {}) => {
	return `
		<div ${stringifyCompAttrs({ classes: ["cols"], options })}>
			${items.map((value) => `<div>${value}</div>`).join("")}
		</div>
	`;
};
