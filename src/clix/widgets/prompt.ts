import type { ClixWidgets } from "~/api.ts";

export const promptWidget: ClixWidgets["prompt"] = ({ label = "", value = "" } = {}) => {
	const result = prompt(label, value);

	if (result === null) {
		Deno.exit();
	}

	return result;
};
