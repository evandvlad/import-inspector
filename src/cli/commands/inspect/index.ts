import { assert } from "~/lib/err.ts";
import { run } from "~/core/index.ts";
import { Config } from "~/config/index.ts";
import { Settings } from "~/settings.ts";

import { Presenter } from "./presenter.ts";

export async function runInspectCommand({ preset }: { preset: string }) {
	const config = await Config.load();
	const settingsPath = config.getSettingsPath({ preset });

	assert(settingsPath, `There is no settings path for preset '${preset}'.`);

	const settings = await Settings.create({ path: settingsPath });
	const presenter = new Presenter();

	const context = await run({ settings });

	presenter.summarize({ context, settings });
}
