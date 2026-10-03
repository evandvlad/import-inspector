import type { ClixWidgets } from "~/api.ts";

export const confirmWidget: ClixWidgets["confirm"] = (message) => {
	return confirm(message);
};
