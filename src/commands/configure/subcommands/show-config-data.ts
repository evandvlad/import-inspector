import { components } from "~/clix/index.ts";
import { configFilePath } from "~/values.ts";
import type { Config } from "~/config/index.ts";

const { code, link, lines } = components;

export function showConfigData(config: Config) {
	const message = lines([
		`Config is located here: ${link(configFilePath)}`,
		code(JSON.stringify(config.data, null, "  ")),
	]);

	console.log(message);
}
