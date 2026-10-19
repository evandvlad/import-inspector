import type { Htmlxc } from "~/api.d.ts";

import { stringifyCompAttrs } from "../helpers.ts";

export const elem: Htmlxc["elem"] = (value, options = {}) => {
	return `
		<div ${stringifyCompAttrs({ classes: ["elem"], options })}>
			${value}
		</div>
	`;
};
