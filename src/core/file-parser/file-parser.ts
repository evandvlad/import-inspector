import { parse, type ParserOptions } from "oxc-parser";

import { Err } from "~/lib/err.ts";

import type { FilePathRec } from "../path-rec-provider/index.ts";

import { extractImportRecs } from "./import-recs-extractor.ts";

function getParserOptions(filePathRec: FilePathRec): ParserOptions {
	const { lang, canUseReactSyntax } = filePathRec.extInfo;

	if (lang === "js" && canUseReactSyntax) {
		return { lang: "jsx" };
	}

	return {};
}

export async function parseFile({ filePathRec, content }: { filePathRec: FilePathRec; content: string }) {
	const { name, path } = filePathRec;
	const options = getParserOptions(filePathRec);

	const { program, errors } = await parse(name, content, options).catch((e) => {
		throw new Err(`An error occurred while parsing the file '${path}'.`, { cause: e });
	});

	if (errors.length > 0) {
		const error = errors.find((item) => item.severity === "Error");

		if (error) {
			const detail = [error.message, error.codeframe ?? ""].join("");
			throw new Err(`An error occurred while parsing the file '${path}'. ${detail}`);
		}
	}

	return extractImportRecs({ content, filePathRec, program });
}
