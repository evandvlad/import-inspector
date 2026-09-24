import type { HtmlxComponents } from "~/api.ts";

import { stringifyCompAttrs } from "./helpers.ts";

export const details: HtmlxComponents["details"] = (props) => {
	const { summary, value, theme = "standard" } = props;
	const classes = ["details", `details--theme-${theme}`];

	return `
		<details ${stringifyCompAttrs({ classes, props })}>
			<summary class="details__summary">${summary}</summary>
			${value}
		</details>
	`;
};
