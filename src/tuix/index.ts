import { Spinner } from "@std/cli/unstable-spinner";
import { type PromptEntry, promptSelect } from "@std/cli/unstable-prompt-select";
import { toFileUrl } from "@std/path";

import { fromLines, tab, toLines } from "~/lib/text.ts";
import { isNull, isString } from "~/lib/vtype.ts";
import type { Tuix as ITuix, TuixSelectItem } from "~/api.ts";

import { text } from "./text.ts";
import { fancifyData } from "./data-fancifier.ts";

class Tuix implements ITuix {
	text = text;

	link(path: string, options?: { text?: string; line?: number }) {
		const { text = path, line } = options ?? {};
		return `\x1b]8;;${toFileUrl(path)}${line ? `#${line}` : ""}\x1b\\${text}\x1b]8;;\x1b\\`;
	}

	lines(items: string[]) {
		return fromLines(items);
	}

	code(value: string, options?: { startLine?: number }) {
		const { startLine = 1 } = options ?? {};

		return fromLines(
			toLines(value).map((line, index) => {
				const num = index + startLine;
				const value = line.replaceAll(tab, " ".repeat(4));
				const lineNum = String(num).padStart(5, " ");

				return [lineNum, " | ", value].join("");
			}),
		);
	}

	spin(message: string) {
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

	select<T extends string = string>(items: TuixSelectItem<T>[], options?: { label?: string }) {
		const { label = "" } = options ?? {};
		const result = promptSelect<T>(label, items as Array<PromptEntry<T>>);

		if (isNull(result)) {
			Deno.exit();
		}

		return result as TuixSelectItem<T>;
	}

	prompt(options?: { label?: string; value?: string }) {
		const { label = "", value = "" } = options ?? {};
		const result = prompt(label, value);

		if (isNull(result)) {
			Deno.exit();
		}

		return result;
	}

	confirm(message: string) {
		return confirm(message);
	}

	clear() {
		console.clear();
	}

	print(value: string | string[]) {
		const val = isString(value) ? value : this.lines(value);
		console.log(val);
	}

	eprint(value: string | string[], options?: { noColor?: boolean }) {
		const { noColor = false } = options ?? {};

		const val = isString(value) ? value : this.lines(value);
		const text = noColor ? val : this.text(val, { color: "red" });

		console.error(text);
	}

	printData(data: unknown) {
		const result = fancifyData(data);
		this.print(result);
	}
}

export const tuix = new Tuix();
