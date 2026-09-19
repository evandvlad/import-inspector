import type { HtmlxComponents } from "~/api.ts";

import { stringifyCompAttrs } from "./helpers.ts";

export const flex: HtmlxComponents["flex"] = (props) => {
	const classes = ["flex"];

	if (props.dir === "h") {
		classes.push("flex--h-dir");
	}

	return `
		<div ${stringifyCompAttrs({ classes, props })}>
			${props.items.map((value) => `<div>${value}</div>`).join("")}
		</div>
	`;
};
