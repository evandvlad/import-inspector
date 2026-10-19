import { sanitizeForHtml } from "~/lib/text.ts";
import type { Htmlxc } from "~/api.d.ts";

import { stringifyCompAttrs } from "../helpers.ts";

export const link: Htmlxc["link"] = ({ url, value }, options = {}) => {
	const attrs = { href: decodeURI(url), title: sanitizeForHtml(value) };

	return `
		<a ${stringifyCompAttrs({ classes: ["link"], attrs, options })}>
			${value}
		</a>
	`;
};
