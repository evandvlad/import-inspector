import type { Context } from "~/api.ts";
import type { Settings } from "~/settings.ts";

import type { InspectionHandler } from "./values.ts";

export async function inspect(
	{ context, settings, inspectionHandlers }: {
		context: Context;
		settings: Settings;
		inspectionHandlers: InspectionHandler[];
	},
) {
	await settings.preInspect(context);
	await Array.fromAsync(inspectionHandlers.map((handler) => handler(context)));
	await settings.postInspect(context);
}
