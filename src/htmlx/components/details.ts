import type { HtmlxComponents } from "~/api.ts";

import { stringifyCompAttrs } from "./helpers.ts";

export const details: HtmlxComponents["details"] = (props) => {
	const { summary, value } = props;

	return `
		<details ${stringifyCompAttrs({ compClass: "c_details", props })}>
			<summary>${summary}</summary>
			${value}
		</details>
	`;
};
