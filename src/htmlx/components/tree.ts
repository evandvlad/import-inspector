import type { HtmlxComponents, HtmlxComponentTreeItem } from "~/api.ts";

import { stringifyCompAttrs } from "../helpers.ts";

function renderTree(items: HtmlxComponentTreeItem[]): string {
	const content = items
		.map(({ value, children }) => {
			if (!children || children.length === 0) {
				return `<div>${value}</div>`;
			}

			return `
				<details class="tree__branch">
					<summary class="tree__branch-handle">${value}</summary>
					${renderTree(children)}
				</details>
			`;
		})
		.join("");

	return `
		<div class="tree__items">
			${content}
		</div>
	`;
}

export const tree: HtmlxComponents["tree"] = (items, options = {}) => {
	if (items.length === 0) {
		return "";
	}

	return `
		<div ${stringifyCompAttrs({ classes: ["tree"], options })}>
			${renderTree(items)}
		</div>
	`;
};
