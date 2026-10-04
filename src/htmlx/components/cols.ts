import type { Htmlxc } from "~/api.ts";

import { stringifyCompAttrs } from "../helpers.ts";

export const cols: Htmlxc["cols"] = (items, options = {}) => {
	return `
		<div ${stringifyCompAttrs({ classes: ["cols"], options })}>
			${items.map((value) => `<div>${value}</div>`).join("")}
		</div>
	`;
};
