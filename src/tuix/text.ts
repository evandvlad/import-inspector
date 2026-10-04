import { blue, bold as makeBold, dim as makeDim, gray, magenta, white } from "@std/fmt/colors";

import type { TuixColor } from "~/api.ts";

const colors: Record<TuixColor, (value: string) => string> = {
	gray,
	blue,
	white,
	red: magenta,
};

export function text(value: string, options?: { bold?: boolean; dim?: boolean; color?: TuixColor }) {
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
