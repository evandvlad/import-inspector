import type { HtmlxComponents } from "~/api.ts";

import { stringifyCompAttrs } from "../helpers.ts";

export const cols: HtmlxComponents["cols"] = (props) => {
	return `
		<div ${stringifyCompAttrs({ classes: ["cols"], props })}>
			${props.items.map((value) => `<div>${value}</div>`).join("")}
		</div>
	`;
};
