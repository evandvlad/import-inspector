import type { HtmlxComponents } from "~/api.ts";
import { sanitizeForHtml } from "~/lib/text.ts";

import { stringifyCompAttrs } from "../helpers.ts";

export const code: HtmlxComponents["code"] = (props) => {
	const content = props.entries.map(({ line, value }) => `
		<div class="code__gutter">${line}</div>
		<div>${sanitizeForHtml(value)}</div>
	`).join("");

	return `
		<div ${stringifyCompAttrs({ classes: ["code"], props })}>
			${content}
		</div>
	`;
};
