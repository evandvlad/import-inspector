import type { HtmlxComponents } from "~/api.ts";

import { encodeHTML, stringifyCompAttrs } from "./helpers.ts";

export const code: HtmlxComponents["code"] = (props) => {
	const content = props.value.split("\n").map((line, index) => `
		<div class="c_code__gutter">${index + 1}</div>
		<div>${encodeHTML(line)}</div>
	`).join("");

	return `<div ${stringifyCompAttrs({ compClass: "c_code", props })}>${content}</div>`;
};
