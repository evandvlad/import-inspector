import { blue, bold as makeBold, dim as makeDim, gray, magenta, white } from "@std/fmt/colors";
import { Spinner } from "@std/cli/unstable-spinner";
import { type PromptEntry, promptSelect } from "@std/cli/unstable-prompt-select";
import { toFileUrl } from "@std/path";

import { fromLines, tab, toLines } from "~/lib/text.ts";
import { isNull, isString } from "~/lib/vtype.ts";
import type { Tuix as ITuix } from "~/api.ts";

const colors = {
	gray,
	blue,
	white,
	red: magenta,
};

type Color = keyof typeof colors;

class Tuix implements ITuix {
	text(value: string, options?: { bold?: boolean; dim?: boolean; color?: Color }) {
		const { color, bold = false, dim = false } = options ?? {};

		let val = value;

		if (color) {
			val = colors[color](val);
		}

		if (bold) {
			val = makeBold(val);
		}

		if (dim) {
			val = makeDim(val);
		}

		return val;
	}

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

	select<T extends string = string>(items: Array<{ label: string; value: T }>, options?: { label?: string }) {
		const { label = "" } = options ?? {};
		const result = promptSelect<T>(label, items as Array<PromptEntry<T>>);

		if (isNull(result)) {
			Deno.exit();
		}

		return result as { label: string; value: T };
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
}

export const tuix = new Tuix();
