import { CRLF, LF } from "@std/fs";

export const br = LF;
export const tab = "\t";

export function encodeHtml(value: string) {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&apos;")
		.replaceAll(tab, "&nbsp;".repeat(4))
		.replaceAll(br, "&nbsp;");
}

export function fromLines(lines: string[]) {
	return lines.join(br);
}

export function toLines(value: string) {
	return value.split(br);
}

export function withBr(value: string, num = 1) {
	return [value, br.repeat(num)].join("");
}

export function normalizeBr(value: string) {
	return value.replaceAll(CRLF, br);
}

export function dedent(value: string) {
	return toLines(value.trim()).map((line) => line.trim()).join(br);
}
