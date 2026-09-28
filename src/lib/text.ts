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

export function withBrTop(value: string, num = 1) {
	return [br.repeat(num), value].join("");
}

export function withBrBot(value: string, num = 1) {
	return [value, br.repeat(num)].join("");
}

export function withBrBoth(value: string, num = 1) {
	const brs = br.repeat(num);
	return [brs, value, brs].join("");
}

export function withTab(value: string, num = 1) {
	return [tab.repeat(num), value].join("");
}

export function normalizeBrs(value: string) {
	return value.replaceAll(CRLF, br);
}

export function dedent(value: string) {
	return toLines(value.trim()).map((line) => line.trim()).join(br);
}

export function delines(value: string) {
	const result = toLines(value).map((line) => {
		const trimmedLine = line.trim();
		return trimmedLine ? `${trimmedLine} ` : "";
	}).join("").trimEnd();

	if (value === value.trim()) {
		return result;
	}

	return value.replace(
		/^(\s*)(.*?)(\s*)$/s,
		(_, p1, _p2, p3) =>
			[
				p1.replaceAll(br, ""),
				result,
				p3.replaceAll(br, ""),
			].join(""),
	);
}
