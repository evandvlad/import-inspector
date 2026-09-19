import { Config } from "~/config/index.ts";

export async function runDisplayConfigCommand() {
	const { data } = await Config.load();
	console.log(data);
}
