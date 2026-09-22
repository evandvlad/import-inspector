import type { HtmlxComponents } from "~/api.ts";

import { stringifyCompAttrs } from "./helpers.ts";

export const desc: HtmlxComponents["desc"] = (props) => {
	const content = props.items.map(([key, value]) => `
		<dt>${key}</dt>
		<dd>${value}</dd>
	`).join("");

	return `<dl ${stringifyCompAttrs({ compClass: "c_desc", props })}>${content}</dl>`;
};
