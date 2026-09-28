import { isAbsolute, join } from "@std/path";

import { withBrBoth } from "~/lib/text.ts";
import { Config } from "~/config/index.ts";

export async function setSettingsPathCommand({ path, preset }: { path: string; preset: string }) {
	const config = await Config.load();

	const preparedPath = isAbsolute(path) ? path : join(Deno.cwd(), path);
	await config.setSettingsPath({ path: preparedPath, preset });

	const message = withBrBoth(`The path '${preparedPath}' was successfully set for the preset '${preset}'.`);

	console.log(message);
}
