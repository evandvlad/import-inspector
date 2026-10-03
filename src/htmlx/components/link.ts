import type { HtmlxComponents } from "~/api.ts";

import { stringifyCompAttrs } from "../helpers.ts";

export const link: HtmlxComponents["link"] = ({ url, value }, options = {}) => {
	const attrs = { href: url, title: value };

	return `
		<a ${stringifyCompAttrs({ classes: ["link"], attrs, options })}>
			${value}
		</a>
	`;
};
