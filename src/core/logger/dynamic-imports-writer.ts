import { join } from "~/lib/upath.ts";
import type { Context } from "~/api.ts";

import { formatYaml } from "../lib/format.ts";

import { writeToFile } from "./helpers.ts";
import { LogFileName } from "./values.ts";

export async function writeDynamicImports({ logsDir, context }: { logsDir: string; context: Context }) {
	const path = join(logsDir, LogFileName.DynamicImports);
	const { imports, env } = context;

	const dynamicImports = imports.getDynamic();

	const content = formatYaml({
		count: dynamicImports.length,
		items: dynamicImports.map(({ sourcePath, line, locator, code, resolution }) => ({
			sourcePath: env.getShortPath(sourcePath),
			line,
			locator,
			code,
			resolution: resolution
				? {
					path: resolution.path ? env.getShortPath(resolution.path) : null,
					isExternal: resolution.isExternal,
					isRelative: resolution.isRelative,
				}
				: null,
		})),
	});

	await writeToFile({ path, content });
}
