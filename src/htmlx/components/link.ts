import type { Htmlxc } from "~/api.d.ts";

import { stringifyCompAttrs } from "../helpers.ts";

export const link: Htmlxc["link"] = ({ url, value }, options = {}) => {
	const attrs = { href: decodeURI(url), title: value };

	return `
		<a ${stringifyCompAttrs({ classes: ["link"], attrs, options })}>
			${value}
		</a>
	`;
};
