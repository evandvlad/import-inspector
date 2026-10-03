import { assertNever } from "~/lib/ts.ts";
import type { Command } from "~/values.ts";
import { Config } from "~/config/index.ts";
import { widgets } from "~/clix/index.ts";

import { createConfig } from "./subcommands/create-config.ts";
import { showConfigData } from "./subcommands/show-config-data.ts";
import { addPreset } from "./subcommands/add-preset.ts";
import { updatePreset } from "./subcommands/update-preset.ts";
import { removePreset } from "./subcommands/remove-preset.ts";
import { selectAction } from "./widgets/action-select.ts";

const { confirm } = widgets;

async function loopUntilQuit(handler: () => Promise<void>) {
	await handler();

	if (confirm("Quit?")) {
		return;
	}

	loopUntilQuit(handler);
}

export const configure: Command = async () => {
	let config = await Config.load();

	loopUntilQuit(async () => {
		console.clear();

		if (!config) {
			config = await createConfig();
			return;
		}

		const { presetNames } = config;
		const action = selectAction({ presetNames });

		console.clear();

		switch (action) {
			case "show-config": {
				showConfigData(config);
				return;
			}

			case "add-preset": {
				await addPreset(config);
				return;
			}

			case "update-preset":
				await updatePreset(config);
				return;

			case "remove-preset":
				await removePreset(config);
				return;

			default:
				assertNever(action);
		}
	});
};
