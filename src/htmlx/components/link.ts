import type { HtmlxComponents } from "~/api.ts";

import { stringifyCompAttrs } from "./helpers.ts";

export const link: HtmlxComponents["link"] = (props) => {
	const { url, value } = props;
	const attrs = { href: url, title: props.value };

	return `
		<a ${stringifyCompAttrs({ classes: ["link"], attrs, props })}>
			${value}
		</a>
	`;
};
