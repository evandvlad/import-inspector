import { components, widgets } from "~/clix/index.ts";

const { text } = components;
const { select } = widgets;

export function selectPreset({ presetNames }: { presetNames: string[] }) {
	const { value } = select(
		presetNames.map((name) => ({ label: name, value: name })),
		{
			label: text("Select preset", { bold: true, color: "blue" }),
		},
	);

	return value;
}
