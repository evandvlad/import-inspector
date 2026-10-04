import { type PromptEntry, promptSelect } from "@std/cli/unstable-prompt-select";

import { isNull } from "~/lib/vtype.ts";
import type { ClixWidgets } from "~/api.ts";

export const select: ClixWidgets["select"] = <T extends string = string>(
	items: Array<{ label: string; value: T }>,
	{ label = "" } = {},
) => {
	const result = promptSelect<T>(label, items as Array<PromptEntry<T>>);

	if (isNull(result)) {
		Deno.exit();
	}

	return result as { label: string; value: T };
};
