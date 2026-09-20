import { assert } from "~/lib/err.ts";
import { CoreRunner } from "~/core/index.ts";
import { Config } from "~/config/index.ts";
import { Settings } from "~/settings.ts";
import { MainLogger } from "~/main-logger/index.ts";
import { Reporter } from "~/reporter.ts";

import { Presenter } from "./presenter.ts";

export async function inspectCommand({ preset }: { preset: string }) {
	const presenter = new Presenter();
	const mainLogger = await MainLogger.create();

	mainLogger.log("started", preset);

	const config = await Config.load();
	mainLogger.log("config-loaded");

	const settingsPath = config.getSettingsPath({ preset });
	assert(settingsPath, `There is no settings path for preset '${preset}'.`);
	const settings = await Settings.create({ path: settingsPath });
	mainLogger.log("settings-created", settingsPath);

	const coreRunner = new CoreRunner({ settings });
	const reporter = new Reporter({ reports: settings.reports });

	mainLogger.attachCoreSub(coreRunner.sub);

	const context = await coreRunner.run();

	await reporter.write({ context });
	const hasDefects = presenter.summarize({ context });

	await mainLogger.log("finished");

	Deno.exit(hasDefects ? 1 : 0);
}
