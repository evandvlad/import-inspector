import { tuix } from "~/tuix/index.ts";

import type { Config } from "~/config/index.ts";
import type { CommandConfigureAction } from "~/values.ts";

export function selectAction(config: Config) {
	const hasPresets = config.presetNames.length > 0;

	const items: Array<{ label: string; value: CommandConfigureAction }> = [
		{ label: "Add preset", value: "add-preset" },
	];

	if (hasPresets) {
		items.push(
			{ label: "Update preset", value: "update-preset" },
			{ label: "Remove preset", value: "remove-preset" },
		);
	}

	items.push(
		{ label: "Show config", value: "show-config" },
		{ label: "Quit", value: "quit" },
	);

	const { value } = tuix.select<CommandConfigureAction>(
		items,
		{ label: tuix.text("Select action", { bold: true, color: "blue" }) },
	);

	return value;
}
