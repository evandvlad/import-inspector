import { join } from "~/lib/upath.ts";
import { formatYaml } from "~/lib/format.ts";

import type { Context } from "../context/index.ts";

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
