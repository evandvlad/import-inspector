import { join } from "~/lib/upath.ts";

import { writeToFile } from "./helpers.ts";
import { LogFileName } from "./values.ts";

export async function writeFilePaths({ logsDir, filePaths }: { logsDir: string; filePaths: string[] }) {
	const path = join(logsDir, LogFileName.FilePaths);
	const content = filePaths.map((path) => `${path}\n`).join("");

	await writeToFile({ path, content });
}
