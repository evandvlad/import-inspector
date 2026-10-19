import { Config } from "~/config/index.ts";
import { tuix } from "~/tuix/index.ts";

export async function createConfig() {
	tuix.print("No presets configured.");

	if (!tuix.confirm("Create config?")) {
		return null;
	}

	const config = await Config.create();

	tuix.print("Config was created.");

	return config;
}
