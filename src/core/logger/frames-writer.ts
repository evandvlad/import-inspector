import { join } from "~/lib/upath.ts";
import type { Context } from "~/api.ts";

import { formatYaml } from "../lib/format.ts";

import { writeToFile } from "./helpers.ts";
import { LogFileName } from "./values.ts";

function getFrames({ frames }: Context) {
	return Object.fromEntries(frames.names.map((name) => [name, frames.getModulesByFrame(name).length]));
}

export async function writeFrames({ logsDir, context }: { logsDir: string; context: Context }) {
	const path = join(logsDir, LogFileName.Frames);
	const content = formatYaml(getFrames(context));

	await writeToFile({ path, content });
}
