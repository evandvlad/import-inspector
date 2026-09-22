import type { HtmlxComponents, HtmlxComponentTreeItem } from "~/api.ts";

import { stringifyCompAttrs } from "./helpers.ts";

function renderTree(items: HtmlxComponentTreeItem[]): string {
	const content = items
		.map(({ value, children }) => {
			if (!children || !children.length) {
				return `<div class="c_tree__leaf">${value}</div>`;
			}

			return `
				<details class="c_tree__branch">
					<summary>${value}</summary>
					${renderTree(children)}
				</details>
			`;
		})
		.join("");

	return `<div class="c_tree__items">${content}</div>`;
}

export const tree: HtmlxComponents["tree"] = (props) => {
	if (!props.items.length) {
		return "";
	}

	return `
		<div ${stringifyCompAttrs({ compClass: "c_tree", props })}>
			${renderTree(props.items)}
		</div>
	`;
};
