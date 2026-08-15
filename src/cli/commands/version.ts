import { version } from "~/env.ts";

export function runVersionCommand() {
	console.log(`v${version}`);
}
