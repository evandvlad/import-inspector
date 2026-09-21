import { stringifyAttrs } from "./helpers.ts";

export function table(
	{ rows, columns, attrs }: { rows: string[][]; columns?: string[]; attrs?: Record<string, string> },
) {
	return `
		<table ${stringifyAttrs(attrs)}>
			${columns ? `<tr>${columns.map((value) => `<th>${value}</th>`)}</tr>` : ""}
			${rows.map((row) => `<tr>${row.map((value) => `<td>${value}</td>`)}</tr>`)}
		</table>`;
}
