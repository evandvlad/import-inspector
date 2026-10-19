import type { Htmlxc } from "~/api.d.ts";

import { stringifyCompAttrs } from "../helpers.ts";

export const table: Htmlxc["table"] = (rows, options = {}) => {
	if (rows.length === 0) {
		return "";
	}

	const cols = rows[0].length;

	const cells = rows.map((row) =>
		row.map((value) => `
			<div class="table__cell">
				${value}
			</div>
		`).join("")
	).join("");

	const attrs = stringifyCompAttrs({
		classes: ["table"],
		styles: { "--cols-number": cols.toString() },
		options,
	});

	return `
		<div ${attrs}>
			${cells}
		</div>
	`;
};
