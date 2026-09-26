import type { HtmlxComponents } from "~/api.ts";

import { stringifyCompAttrs } from "./helpers.ts";

export const expander: HtmlxComponents["expander"] = (props) => {
	const { label, value } = props;

	return `
		<details ${stringifyCompAttrs({ classes: ["expander"], props })}>
			<summary class="expander__label">${label}</summary>
			<div class="expander__content">
				${value}
			</div>
		</details>
	`;
};
