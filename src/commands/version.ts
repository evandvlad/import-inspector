import { type Command, version as appVersion } from "~/values.ts";

export const version: Command = () => {
	console.log(`v${appVersion}`);
};
