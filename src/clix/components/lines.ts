import { fromLines } from "~/lib/text.ts";
import type { ClixComponents } from "~/api.ts";

export const lines: ClixComponents["lines"] = (items: string[]) => {
	return fromLines(items);
};
