import { fromLines } from "~/lib/text.ts";
import { code, link } from "~/lib/cli-view.ts";
import { configFilePath } from "~/values.ts";
import type { Config } from "~/config/index.ts";

export function showConfigData(config: Config) {
	const message = fromLines([
		`Config is located here: ${link({ path: configFilePath })}`,
		code({ value: JSON.stringify(config.data, null, "  ") }),
	]);

	console.log(message);
}
