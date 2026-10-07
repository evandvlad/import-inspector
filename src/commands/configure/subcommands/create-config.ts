import { Config } from "~/config/index.ts";
import { tuix } from "~/tuix.ts";

export async function createConfig() {
	tuix.print("Workflow is not configured yet.");

	if (!tuix.confirm("Create config?")) {
		return null;
	}

	const config = await Config.create();

	tuix.print(`Config was created.`);

	return config;
}
