import type { Htmlxc } from "~/api.ts";

import { stringifyCompAttrs } from "../helpers.ts";

export const h: Htmlxc["h"] = (value, options = {}) => {
	const { level = 2 } = options;
	const classes = ["h", `h--${level}`];

	return `
		<h${level} ${stringifyCompAttrs({ classes, options })}>
			${value}
		</h${level}>
	`;
};
