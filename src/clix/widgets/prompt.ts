import { isNull } from "~/lib/vtype.ts";
import type { ClixWidgets } from "~/api.ts";

export const promptWidget: ClixWidgets["prompt"] = ({ label = "", value = "" } = {}) => {
	const result = prompt(label, value);

	if (isNull(result)) {
		Deno.exit();
	}

	return result;
};
