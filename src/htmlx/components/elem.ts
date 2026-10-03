import type { HtmlxComponents } from "~/api.ts";

import { stringifyCompAttrs } from "../helpers.ts";

export const elem: HtmlxComponents["elem"] = (value, options = {}) => {
	return `
		<div ${stringifyCompAttrs({ classes: ["elem"], options })}>
			${value}
		</div>
	`;
};
