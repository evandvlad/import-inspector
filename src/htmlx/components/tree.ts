import type { Htmlxc, HtmlxcTreeItem } from "~/api.ts";

import { stringifyCompAttrs } from "../helpers.ts";

function renderTree(items: HtmlxcTreeItem[]): string {
	const content = items
		.map(({ value, children, opened = false }) => {
			if (!children || children.length === 0) {
				return `<div>${value}</div>`;
			}

			return `
				<details class="tree__branch" ${opened ? "open" : ""}>
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

export const tree: Htmlxc["tree"] = (items, options = {}) => {
	if (items.length === 0) {
		return "";
	}

	const classes = ["tree"];

	if (options.subtree) {
		classes.push("tree--subtree");
	}

	return `
		<div ${stringifyCompAttrs({ classes, options })}>
			${renderTree(items)}
		</div>
	`;
};
