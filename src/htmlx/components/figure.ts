import type { HtmlxComponents } from "~/api.ts";

import { stringifyCompAttrs } from "./helpers.ts";

export const figure: HtmlxComponents["figure"] = (props) => {
	const { label, value } = props;

	return `
		<div ${stringifyCompAttrs({ classes: ["figure"], props })}>
			<h2 class="figure__label">${label}</h2>
			<div>${value}</div>
		</div>
	`;
};
