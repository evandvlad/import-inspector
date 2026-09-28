import { withBrBoth } from "~/lib/text.ts";

import { Config } from "~/config/index.ts";

export async function displayConfigCommand() {
	const { data } = await Config.load();
	const value = withBrBoth(JSON.stringify(data, null, "  "));

	console.log(value);
}
