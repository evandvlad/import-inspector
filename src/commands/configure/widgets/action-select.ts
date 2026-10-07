import { tuix } from "~/tuix.ts";

import type { Action } from "../values.ts";

export function selectAction({ presetNames }: { presetNames: string[] }) {
	const hasPresets = presetNames.length > 0;

	const items: Array<{ label: string; value: Action }> = [
		{ label: "Show config", value: "show-config" },
		{ label: "Add preset", value: "add-preset" },
	];

	if (hasPresets) {
		items.push(
			{ label: "Update preset", value: "update-preset" },
			{ label: "Remove preset", value: "remove-preset" },
		);
	}

	const { value } = tuix.select<Action>(
		items,
		{ label: tuix.text("Select action", { bold: true, color: "blue" }) },
	);

	return value;
}
