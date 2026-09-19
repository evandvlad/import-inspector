import { Config } from "~/config/index.ts";

export async function displayConfigCommand() {
	const { data } = await Config.load();
	console.log(data);
}
