import type { HtmlxComponents } from "~/api.ts";

import { stringifyCompAttrs } from "../helpers.ts";

export const mark: HtmlxComponents["mark"] = (value, options = {}) => {
	return `
		<span ${stringifyCompAttrs({ classes: ["mark"], options })}>
			${value}
		</span>
	`;
};
