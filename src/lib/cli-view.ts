import { toFileUrl } from "@std/path";
import { Spinner } from "@std/cli/unstable-spinner";
import { type PromptEntry, promptSelect } from "@std/cli/unstable-prompt-select";

import { fromLines, toLines } from "~/lib/text.ts";

export type SelectItem<T extends string = string> = PromptEntry<T>;

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
	let isStopped = false;

	spinner.start();

	return {
		stop() {
			if (isStopped) {
				return;
			}

			isStopped = true;

			spinner.stop();
		},
	};
}

export function select<T extends string>({ items, label = "" }: { items: Array<SelectItem<T>>; label?: string }) {
	const result = promptSelect<T>(label, items);

	if (result === null) {
		Deno.exit();
	}

	return result;
}

export function prompt({ label = "", value = "" }: { label?: string; value?: string }) {
	const result = global.prompt(label, value);

	if (result === null) {
		Deno.exit();
	}

	return result;
}
