import { join } from "~/lib/upath.ts";

import { formatYaml } from "../lib/format.ts";
import type { Context } from "../context/index.ts";

import { writeToFile } from "./helpers.ts";
import { LogFileName } from "./values.ts";

export async function writeDynamicImports({ logsDir, context }: { logsDir: string; context: Context }) {
	const path = join(logsDir, LogFileName.DynamicImports);
	const { imports, pathUtil } = context;

	const dynamicImports = imports.getDynamic();

	const content = formatYaml({
		count: dynamicImports.length,
		items: dynamicImports.map(({ sourcePath, line, locator, code, resolution }) => ({
			sourcePath: pathUtil.getShortPath(sourcePath),
			line,
			locator,
			code,
			resolution: resolution
				? {
					path: resolution.path ? pathUtil.getShortPath(resolution.path) : null,
					isExternal: resolution.isExternal,
					isRelative: resolution.isRelative,
				}
				: null,
		})),
	});

	await writeToFile({ path, content });
}
