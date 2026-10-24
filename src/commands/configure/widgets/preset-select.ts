import { tuix } from "~/tuix/index.ts";

export function selectPreset({ presetNames }: { presetNames: string[] }) {
	const { value } = tuix.select(
		presetNames.map((name) => ({ label: name, value: name })),
		{ label: "Select preset" },
	);

	return value;
}
