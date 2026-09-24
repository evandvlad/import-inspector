import type { HtmlxComponents } from "~/api.ts";

import { stringifyCompAttrs } from "./helpers.ts";

export const table: HtmlxComponents["table"] = (props) => {
	if (!props.rows.length) {
		return "";
	}

	const { columns, rows } = props;
	const cols = rows[0].length;

	const headerCells = columns
		? columns.map((value) => `<div class="table__cell table__cell--header">${value}</div>`).join("")
		: "";

	const dataCells = rows.map((row, i) => {
		const isOdd = Boolean(i % 2);

		return row.map((value) => `
			<div class="table__cell table__cell--data-cell-${isOdd ? "odd" : "even"}">
				${value}
			</div>
		`).join("");
	}).join("");

	return `
		<div ${stringifyCompAttrs({ classes: ["table"], styles: { "--cols-number": cols.toString() }, props })}>
			${headerCells}
			${dataCells}
		</div>
	`;
};
