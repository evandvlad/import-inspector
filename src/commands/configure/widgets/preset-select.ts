import { tuix } from "~/tuix/index.ts";

export function selectPreset({ presetNames }: { presetNames: string[] }) {
	const { value } = tuix.select(
		presetNames.map((name) => ({ label: name, value: name })),
		{
			label: tuix.text("Select preset", { bold: true, color: "blue" }),
		},
	);

	return value;
}
