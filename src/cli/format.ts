import { toFileUrl } from "@std/path";

export function dedent(text: string) {
	return text.trim().split("\n").map((line) => line.trim()).join("\n");
}

export function link({ text, path }: { text: string; path: string }) {
	return `\x1b]8;;${toFileUrl(path)}\x1b\\${text}\x1b]8;;\x1b\\`;
}
