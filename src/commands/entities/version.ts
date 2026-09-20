import { version } from "~/values.ts";

export function versionCommand() {
	console.log(`v${version}`);
}
