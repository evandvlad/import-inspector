import type { HtmlxComponents } from "~/api.ts";

import { stringifyCompAttrs } from "./helpers.ts";

export const h: HtmlxComponents["h"] = (props) => {
	const { value, level } = props;
	const classes = ["h", `h--${level}`];

	return `
		<h${level} ${stringifyCompAttrs({ classes, props })}>
			${value}
		</h${level}>
	`;
};
