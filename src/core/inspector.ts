import type { Context } from "./context/index.ts";
import type { Config } from "./config.ts";
import type { InspectionHandler } from "./values.ts";

export async function inspect(
	{ context, config, inspectionHandlers }: {
		context: Context;
		config: Config;
		inspectionHandlers: InspectionHandler[];
	},
) {
	await config.preInspect(context);
	await Array.fromAsync(inspectionHandlers.map((handler) => handler(context)));
	await config.postInspect(context);
}
