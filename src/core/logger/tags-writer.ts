import { join } from "~/lib/upath.ts";
import { formatYaml } from "~/lib/format.ts";

import type { Context } from "../context/index.ts";

import { writeToFile } from "./helpers.ts";
import { LogFileName } from "./values.ts";

function getTags({ tags }: Context) {
	const byTag = Object.fromEntries(tags.getAll().map((tag) => [tag, tags.getModulesByTag(tag).length]));

	return {
		byTag,
		total: Object.values(byTag).reduce((acc, count) => acc + count, 0),
	};
}

export async function writeTags({ logsDir, context }: { logsDir: string; context: Context }) {
	const path = join(logsDir, LogFileName.Tags);
	const content = formatYaml(getTags(context));

	await writeToFile({ path, content });
}
