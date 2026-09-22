import type { HtmlxComponents } from "~/api.ts";

import { stringifyCompAttrs } from "./helpers.ts";

export const table: HtmlxComponents["table"] = (props) => {
	const { columns, rows } = props;

	return `
		<table ${stringifyCompAttrs({ props })}>
			${columns ? `<tr>${columns.map((value) => `<th>${value}</th>`)}</tr>` : ""}
			${rows.map((row) => `<tr>${row.map((value) => `<td>${value}</td>`)}</tr>`)}
		</table>
	`;
};
