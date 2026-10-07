import { blue, bold as makeBold, dim as makeDim, gray, magenta, white } from "@std/fmt/colors";

const colors = {
	gray,
	blue,
	white,
	red: magenta,
};

type Color = keyof typeof colors;

export function text(value: string, options?: { bold?: boolean; dim?: boolean; color?: Color }) {
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
