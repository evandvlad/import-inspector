import { Config } from "~/config/index.ts";
import { widgets } from "~/clix/index.ts";

const { confirm } = widgets;

export async function createConfig() {
	console.log("Workflow is not configured yet.");

	if (!confirm("Create config?")) {
		return null;
	}

	const config = await Config.create();

	console.log(`Config was created.`);

	return config;
}
