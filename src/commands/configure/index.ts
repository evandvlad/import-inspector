import type { MaybePromise } from "~/lib/ts.ts";
import type { TuixSelectItem } from "~/api.d.ts";
import type { Command } from "~/values.ts";
import { Config } from "~/config/index.ts";
import { tuix } from "~/tuix/index.ts";

import { createConfig } from "./subcommands/create-config.ts";
import { showConfigData } from "./subcommands/show-config-data.ts";
import { addPreset } from "./subcommands/add-preset.ts";
import { updatePreset } from "./subcommands/update-preset.ts";
import { removePreset } from "./subcommands/remove-preset.ts";

type Action = TuixSelectItem & { perform: () => MaybePromise<void> };

function selectAction(config: Config) {
	const hasPresets = config.presetNames.length > 0;

	const items: Action[] = [
		{
			label: "Add preset",
			value: "add-preset",
			async perform() {
				await addPreset(config);
			},
		},
	];

	if (hasPresets) {
		items.push(
			{
				label: "Update preset",
				value: "update-preset",
				async perform() {
					await updatePreset(config);
				},
			},
			{
				label: "Remove preset",
				value: "remove-preset",
				async perform() {
					await removePreset(config);
				},
			},
		);
	}

	items.push(
		{
			label: "Show config",
			value: "show-config",
			perform() {
				showConfigData(config);
			},
		},
		{
			label: "Quit",
			value: "quit",
			perform() {
				Deno.exit();
			},
		},
	);

	return tuix.select<Action>(items, { label: "Select action" });
}

async function* actionGenerator(config: Config) {
	while (true) {
		yield selectAction(config);
	}
}

export const configure: Command = async () => {
	let config = await Config.load();

	if (!config) {
		config = await createConfig();

		if (!config) {
			return;
		}

		tuix.print("");
	}

	for await (const action of actionGenerator(config)) {
		tuix.clear();
		await action.perform();
		tuix.print("");
	}
};
