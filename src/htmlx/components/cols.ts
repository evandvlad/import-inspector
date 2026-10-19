import type { Htmlxc } from "~/api.d.ts";

import { stringifyCompAttrs } from "../helpers.ts";

export const cols: Htmlxc["cols"] = (items, options = {}) => {
	return `
		<div ${stringifyCompAttrs({ classes: ["cols"], options })}>
			${items.map((value) => `<div>${value}</div>`).join("")}
		</div>
	`;
};
