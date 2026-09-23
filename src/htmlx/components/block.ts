import type { HtmlxComponents } from "~/api.ts";

import { stringifyCompAttrs } from "./helpers.ts";

export const block: HtmlxComponents["block"] = (props) => {
	return `
		<div ${stringifyCompAttrs({ classes: ["block"], props })}>
			${props.value}
		</div>
	`;
};
