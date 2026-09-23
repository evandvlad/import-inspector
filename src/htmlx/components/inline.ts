import type { HtmlxComponents } from "~/api.ts";

import { stringifyCompAttrs } from "./helpers.ts";

export const inline: HtmlxComponents["inline"] = (props) => {
	return `
		<span ${stringifyCompAttrs({ classes: ["inline"], props })}>
			${props.value}
		</span>
	`;
};
