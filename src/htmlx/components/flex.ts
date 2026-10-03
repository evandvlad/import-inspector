import type { HtmlxComponents } from "~/api.ts";

import { stringifyCompAttrs } from "../helpers.ts";

export const flex: HtmlxComponents["flex"] = (items, options = {}) => {
	const classes = ["flex"];

	if (options.dir === "h") {
		classes.push("flex--h-dir");
	}

	return `
		<div ${stringifyCompAttrs({ classes, options })}>
			${items.map((value) => `<div>${value}</div>`).join("")}
		</div>
	`;
};
