import { Err } from "~/lib/err.ts";

import type { Config } from "./config.ts";
import type { Pub } from "./pub-sub/index.ts";
import type { FileParsingResult } from "./values.ts";
import type { PathRecProvider } from "./path-rec-provider/index.ts";
import { FileParser } from "./file-parser/index.ts";

export async function parseFiles({ config, pathRecProvider, pub }: {
	pub: Pub;
	config: Config;
	pathRecProvider: PathRecProvider;
}) {
	const fileParser = new FileParser({ config });
	const result: FileParsingResult[] = [];

	for await (const path of pathRecProvider.filePaths) {
		const content = await Deno.readTextFile(path).catch((e) => {
			throw new Err(`Can't read file at path '${path}'.`, { cause: e });
		});

		result.push(await fileParser.parse({ filePathRec: pathRecProvider.getFilePathRec(path), content }));
		pub.send("files-parser:file-parsed", path);
	}

	return result;
}
