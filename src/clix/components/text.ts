import { blue, bold as makeBold, dim as makeDim, gray, magenta, white } from "@std/fmt/colors";
import type { ClixComponents } from "~/api.ts";

const colors = {
	gray,
	blue,
	white,
	red: magenta,
};

export const text: ClixComponents["text"] = (value, { color, bold = false, dim = false } = {}) => {
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
};
