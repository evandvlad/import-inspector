import type { HtmlxComponents } from "~/api.ts";

import { stringifyCompAttrs } from "./helpers.ts";

export const elem: HtmlxComponents["elem"] = (props) => {
	return `
		<div ${stringifyCompAttrs({ classes: ["elem"], props })}>
			${props.value}
		</div>
	`;
};
