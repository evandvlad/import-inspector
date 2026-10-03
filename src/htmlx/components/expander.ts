import type { HtmlxComponents } from "~/api.ts";

import { stringifyCompAttrs } from "../helpers.ts";

export const expander: HtmlxComponents["expander"] = ({ label, value }, options = {}) => {
	return `
		<details ${stringifyCompAttrs({ classes: ["expander"], options })}>
			<summary class="expander__label">${label}</summary>
			<div class="expander__content">
				${value}
			</div>
		</details>
	`;
};
