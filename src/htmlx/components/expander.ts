import type { HtmlxComponents } from "~/api.ts";

import { stringifyCompAttrs } from "./helpers.ts";

export const expander: HtmlxComponents["expander"] = (props) => {
	const { summary, value } = props;

	return `
		<details ${stringifyCompAttrs({ compClass: "c-expander", props })}>
			<summary>${summary}</summary>
			${value}
		</details>
	`;
};
