import { blue, bold } from "@std/fmt/colors";

import { select, type SelectItem } from "~/lib/cli-view.ts";

import type { Action } from "../values.ts";

export function selectAction({ presetNames }: { presetNames: string[] }) {
	const hasPresets = presetNames.length > 0;

	const items: Array<SelectItem<Action>> = [
		{ label: "Show config", value: "show-config" },
		{ label: "Add preset", value: "add-preset" },
	];

	if (hasPresets) {
		items.push(
			{ label: "Update preset", value: "update-preset" },
			{ label: "Remove preset", value: "remove-preset" },
		);
	}

	const { value } = select<Action>({
		items,
		label: blue(bold("Select action")),
	});

	return value;
}
