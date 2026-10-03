import type { HtmlxComponents } from "~/api.ts";

import { stringifyCompAttrs } from "../helpers.ts";

export const table: HtmlxComponents["table"] = (rows, options = {}) => {
	if (rows.length === 0) {
		return "";
	}

	const cols = rows[0].length;

	const headerCells = options.columns
		? options.columns.map((value) => `<div class="table__cell table__cell--header">${value}</div>`).join("")
		: "";

	const dataCells = rows.map((row, i) => {
		const isOdd = i % 2 !== 0;

		return row.map((value) => `
			<div class="table__cell table__cell--data-cell-${isOdd ? "odd" : "even"}">
				${value}
			</div>
		`).join("");
	}).join("");

	const attrs = stringifyCompAttrs({
		classes: ["table"],
		styles: { "--cols-number": cols.toString() },
		options,
	});

	return `
		<div ${attrs}>
			${headerCells}
			${dataCells}
		</div>
	`;
};
