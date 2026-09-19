import { toFileUrl } from "@std/path";

export function dedent(text: string) {
	return text.trim().split("\n").map((line) => line.trim()).join("\n");
}

export function link({ text, path, line }: { text: string; path: string; line?: number }) {
	return `\x1b]8;;${toFileUrl(path)}${line ? `#${line}` : ""}\x1b\\${text}\x1b]8;;\x1b\\`;
}
