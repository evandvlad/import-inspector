import { withBrBoth } from "~/lib/text.ts";
import { version } from "~/values.ts";

export function versionCommand() {
	console.log(withBrBoth(`v${version}`));
}
