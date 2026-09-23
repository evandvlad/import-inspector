import type { HtmlxComponents } from "~/api.ts";

import { stringifyCompAttrs } from "./helpers.ts";

export const mark: HtmlxComponents["mark"] = (props) => {
	return `
		<span ${stringifyCompAttrs({ classes: ["mark"], props })}>
			${props.value}
		</span>
	`;
};
