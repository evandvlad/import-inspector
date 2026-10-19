import { configFilePath } from "~/values.ts";
import type { Config } from "~/config/index.ts";
import { tuix } from "~/tuix/index.ts";

export function showConfigData(config: Config) {
	tuix.print([
		`The config file is ${tuix.link(configFilePath)}`,
		tuix.code(JSON.stringify(config.data, null, "  ")),
	]);
}
