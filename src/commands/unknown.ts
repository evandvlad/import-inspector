import { components } from "~/clix/index.ts";
import { type Command, CommandName } from "~/values.ts";

const { text, lines } = components;

export const unknown: Command = () => {
	const message = lines([
		text("Incorrect usage", { bold: true, color: "red" }),
		`You can use ${text(CommandName.Help, { color: "blue" })} command (... ${CommandName.Help}) for your help.`,
	]);

	console.error(message);
	Deno.exit(1);
};
