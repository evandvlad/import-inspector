import { parse } from "oxc-parser";

import { Err, rethrowErr } from "~/lib/err.ts";
import { getParserOptions } from "~/project-specifics.ts";

import { extractImpex } from "./impex-extractor.ts";

export async function parseFile({ path, content }: { path: string; content: string }) {
	const options = getParserOptions(path);

	const { program, errors } = await parse(path, content, options).catch(
		rethrowErr(`Failed to parse file '${path}'.`),
	);

	if (errors.length > 0) {
		const error = errors.find((item) => item.severity === "Error");

		if (error) {
			const detail = [error.message, error.codeframe ?? ""].join("");
			throw new Err(`Failed to parse file '${path}'. ${detail}`);
		}
	}

	return extractImpex({ program });
}
