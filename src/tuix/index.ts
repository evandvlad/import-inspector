import { Spinner } from "@std/cli/unstable-spinner";
import { promptSelect } from "@std/cli/unstable-prompt-select";
import { toFileUrl } from "@std/path";

import { fromLines, tab, toLines } from "~/lib/text.ts";
import { isArray, isNull } from "~/lib/vtype.ts";
import type { FnEmpty } from "~/lib/ts.ts";
import type { Tuix as ITuix, TuixSelectItem } from "~/api.d.ts";

import { text } from "./text.ts";
import { prettifyData } from "./data-prettifier.ts";

const cancelExitCode = 130;

export const tuix = new class Tuix implements ITuix {
	text = text;

	link(path: string, options?: { text?: string; line?: number }) {
		const { text = path, line } = options ?? {};
		return `\x1b]8;;${toFileUrl(path)}${line !== undefined ? `#${line}` : ""}\x1b\\${text}\x1b]8;;\x1b\\`;
	}

	lvLine(label: string, value: string) {
		return `${text(label, { bold: true })}: ${value}`;
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

	withSpin<T>(message: string, fn: (stop: FnEmpty) => Promise<T>) {
		const spinner = new Spinner({ message });
		let isStopped = false;

		function stop() {
			if (!isStopped) {
				isStopped = true;
				spinner.stop();
			}
		}

		spinner.start();

		return fn(stop).finally(stop);
	}

	select<T extends TuixSelectItem = TuixSelectItem>(items: T[], options?: { label?: string }) {
		const { label = "" } = options ?? {};
		const lab = label ? this.text(label, { bold: true, color: "blue" }) : "";

		const result = promptSelect<string>(lab, items);

		if (isNull(result)) {
			Deno.exit(cancelExitCode);
		}

		return items.find((item) => item.value === result.value)!;
	}

	prompt(options?: { label?: string; value?: string }) {
		const { label = "", value = "" } = options ?? {};
		const result = prompt(label, value);

		if (isNull(result)) {
			Deno.exit(cancelExitCode);
		}

		return result;
	}

	confirm(message: string) {
		return confirm(message);
	}

	clear() {
		console.clear();
		return this;
	}

	print(value: string | string[]) {
		if (isArray(value) && value.length === 0) {
			return this;
		}

		const val = isArray(value) ? this.lines(value) : value;
		console.log(val);

		return this;
	}

	eprint(value: string | string[], options?: { noColor?: boolean }) {
		if (isArray(value) && value.length === 0) {
			return this;
		}

		const { noColor = false } = options ?? {};

		const val = isArray(value) ? this.lines(value) : value;
		const txt = noColor ? val : this.text(val, { color: "red" });

		console.error(txt);
		return this;
	}

	printData(data: unknown) {
		const result = prettifyData(data);
		this.print(result);
		return this;
	}
}();
