import { Config } from "~/config/index.ts";

export async function createConfig() {
	console.log("Workflow is not configured yet.");

	if (!confirm("Create config?")) {
		return null;
	}

	const config = await Config.create();

	console.log(`Config was created.`);

	return config;
}
