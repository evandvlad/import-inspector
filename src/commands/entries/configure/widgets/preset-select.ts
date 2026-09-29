import { blue, bold } from "@std/fmt/colors";

import { select } from "~/lib/cli-view.ts";

export function selectPreset({ presetNames }: { presetNames: string[] }) {
	const { value } = select({
		label: blue(bold("Select preset")),
		items: presetNames.map((name) => ({ label: name, value: name })),
	});

	return value;
}
