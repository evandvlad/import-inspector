import { type Command, version as appVersion } from "~/values.ts";
import { tuix } from "~/tuix.ts";

export const version: Command = () => {
	tuix.print(`v${appVersion}`);
};
