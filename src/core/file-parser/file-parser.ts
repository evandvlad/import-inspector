import { parse } from "oxc-parser";

import { Err, rethrowErr } from "~/lib/err.ts";

import { getParserOptions } from "../project-specifics.ts";

import { extractImportRecs } from "./import-recs-extractor.ts";

export async function parseFile({ path, content }: { path: string; content: string }) {
	const options = getParserOptions(path);

	const { program, errors } = await parse(path, content, options).catch(
		rethrowErr(`An error occurred while parsing the file '${path}'.`),
	);

	if (errors.length > 0) {
		const error = errors.find((item) => item.severity === "Error");

		if (error) {
			const detail = [error.message, error.codeframe ?? ""].join("");
			throw new Err(`An error occurred while parsing the file '${path}'. ${detail}`);
		}
	}

	return extractImportRecs({ content, path, program });
}
