import { Err } from "~/lib/err.ts";

export async function writeToFile({ path, content, append }: { path: string; content: string; append?: boolean }) {
	const options: Deno.WriteFileOptions = { create: true };

	if (append) {
		options.append = true;
	}

	await Deno.writeTextFile(path, content, options).catch((e) => {
		throw new Err(`An error occurred while writing to the file '${path}'.`, { cause: e });
	});
}
