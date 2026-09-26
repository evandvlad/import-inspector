import type { HtmlxComponents } from "~/api.ts";

import { stringifyCompAttrs } from "./helpers.ts";

export const box: HtmlxComponents["box"] = (props) => {
	const classes = ["box"];

	if (props.dir === "h") {
		classes.push("box--h-dir");
	}

	return `
		<div ${stringifyCompAttrs({ classes, props })}>
			${props.items.map((value) => `<div>${value}</div>`).join("")}
		</div>
	`;
};
