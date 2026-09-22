import type { HtmlxComponents } from "~/api.ts";

import { stringifyCompAttrs } from "./helpers.ts";

export const grid: HtmlxComponents["grid"] = (props) => {
	return `
		<div ${stringifyCompAttrs({ compClass: "c_grid", props })}>
			${props.items.join("")}
		</div>
	`;
};
