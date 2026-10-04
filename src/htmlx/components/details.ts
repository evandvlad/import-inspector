import type { Htmlxc } from "~/api.ts";

import { stringifyCompAttrs } from "../helpers.ts";

export const details: Htmlxc["details"] = ({ label, value }, options = {}) => {
	const { theme = "standard" } = options;
	const classes = ["details", `details--theme-${theme}`];

	return `
		<details ${stringifyCompAttrs({ classes, options })}>
			<summary class="details__label">
				${label}
			</summary>
			${value}
		</details>
	`;
};
