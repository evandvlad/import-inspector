import { assertNever } from "~/lib/ts.ts";
import type { Command, CommandConfigureAction } from "~/values.ts";
import { Config } from "~/config/index.ts";
import { tuix } from "~/tuix/index.ts";

import { createConfig } from "./subcommands/create-config.ts";
import { showConfigData } from "./subcommands/show-config-data.ts";
import { addPreset } from "./subcommands/add-preset.ts";
import { updatePreset } from "./subcommands/update-preset.ts";
import { removePreset } from "./subcommands/remove-preset.ts";
import { selectAction } from "./widgets/action-select.ts";

async function performAction({ action, config }: { action: CommandConfigureAction; config: Config }) {
	switch (action) {
		case "show-config":
			showConfigData(config);
			return;

		case "add-preset":
			await addPreset(config);
			return;

		case "update-preset":
			await updatePreset(config);
			return;

		case "remove-preset":
			await removePreset(config);
			return;

		case "quit":
			Deno.exit();
			return;

		default:
			assertNever(action);
	}
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
		await performAction({ action, config });
		tuix.print("");
	}
};
