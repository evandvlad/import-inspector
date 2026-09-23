import type { HtmlxComponents } from "~/api.ts";

import { stringifyCompAttrs } from "./helpers.ts";

export const details: HtmlxComponents["details"] = (props) => {
	const { summary, value } = props;

	return `
		<details ${stringifyCompAttrs({ classes: ["details"], props })}>
			<summary class="details__summary">${summary}</summary>
			${value}
		</details>
	`;
};
