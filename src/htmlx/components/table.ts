import type { HtmlxComponents } from "~/api.ts";

import { stringifyCompAttrs } from "./helpers.ts";

export const table: HtmlxComponents["table"] = (props) => {
	const { columns, rows } = props;

	return `
		<div ${stringifyCompAttrs({ compClass: "c_table", props })}>
			<table>
				${columns ? `<tr>${columns.map((value) => `<th>${value}</th>`).join("")}</tr>` : ""}
				${rows.map((row) => `<tr>${row.map((value) => `<td>${value}</td>`).join("")}</tr>`).join("")}
			</table>
		</div>
	`;
};
