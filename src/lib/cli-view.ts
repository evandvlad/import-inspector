import { toFileUrl } from "@std/path";
import { Spinner } from "@std/cli/unstable-spinner";

import { br, fromLines, toLines } from "~/lib/text.ts";

const textEncoder = new TextEncoder();

function clearLastLine() {
	Deno.stdout.writeSync(textEncoder.encode("\x1b[1A\x1b[2K"));
}

export function link({ path, text = path, line }: { path: string; text?: string; line?: number }) {
	return `\x1b]8;;${toFileUrl(path)}${line ? `#${line}` : ""}\x1b\\${text}\x1b]8;;\x1b\\`;
}

export function code({ value, startLine = 1 }: { value: string; startLine?: number }) {
	return fromLines(
		toLines(value).map((line, index) => {
			const num = index + startLine;
			const lineNum = String(num).padStart(5, " ");

			return [lineNum, " | ", line].join("");
		}),
	);
}

export function spin({ message }: { message: string }) {
	const spinner = new Spinner({ message });

	console.log(br);
	spinner.start();

	return {
		stop() {
			spinner.stop();
			clearLastLine();
		},
	};
}
