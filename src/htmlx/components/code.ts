import type { HtmlxComponents } from "~/api.ts";
import { encodeHtml } from "~/lib/text.ts";

import { stringifyCompAttrs } from "./helpers.ts";

export const code: HtmlxComponents["code"] = (props) => {
	const content = props.entries.map(({ line, value }) => `
		<div class="code__gutter">${line}</div>
		<div>${encodeHtml(value)}</div>
	`).join("");

	return `
		<div ${stringifyCompAttrs({ classes: ["code"], props })}>
			${content}
		</div>
	`;
};
