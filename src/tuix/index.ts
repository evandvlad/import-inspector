import { Spinner } from "@std/cli/unstable-spinner";
import { type PromptEntry, promptSelect } from "@std/cli/unstable-prompt-select";
import { toFileUrl } from "@std/path";

import { fromLines, tab, toLines } from "~/lib/text.ts";
import { isNull, isString } from "~/lib/vtype.ts";
import { loop } from "~/lib/async.ts";
import type { FnEmpty, MaybePromise } from "~/lib/ts.ts";
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

	select<T extends string = string>(items: TuixSelectItem<T>[], options?: { label?: string }) {
		const { label = "" } = options ?? {};
		const result = promptSelect<T>(label, items as Array<PromptEntry<T>>);

		if (isNull(result)) {
			Deno.exit(cancelExitCode);
		}

		return result as TuixSelectItem<T>;
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
	}

	print(value: string | string[]) {
		const val = isString(value) ? value : this.lines(value);
		console.log(val);
	}

	eprint(value: string | string[], options?: { noColor?: boolean }) {
		const { noColor = false } = options ?? {};

		const val = isString(value) ? value : this.lines(value);
		const txt = noColor ? val : this.text(val, { color: "red" });

		console.error(txt);
	}

	printData(data: unknown) {
		const result = prettifyData(data);
		this.print(result);
	}

	loopUntil = async (fn: () => MaybePromise<void>, confirm: () => MaybePromise<boolean>) => {
		return await loop(async () => {
			await fn();
			return await confirm();
		});
	};
}();
