import type { Htmlxc } from "~/api.ts";

import { stringifyCompAttrs } from "../helpers.ts";

export const mark: Htmlxc["mark"] = (value, options = {}) => {
	return `
		<span ${stringifyCompAttrs({ classes: ["mark"], options })}>
			${value}
		</span>
	`;
};
