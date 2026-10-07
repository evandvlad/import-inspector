import { configFilePath } from "~/values.ts";
import type { Config } from "~/config/index.ts";
import { tuix } from "~/tuix.ts";

export function showConfigData(config: Config) {
	const message = [
		`Config is located here: ${tuix.link(configFilePath)}`,
		tuix.code(JSON.stringify(config.data, null, "  ")),
	];

	tuix.print(message);
}
