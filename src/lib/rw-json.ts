import { Err } from "~/lib/err.ts";

export async function readJson({ path }: { path: string }) {
	const content = await Deno.readTextFile(path).catch((e) => {
		throw new Err(`Can't read the file '${path}'.`, { cause: e });
	});

	try {
		return JSON.parse(content) as unknown;
	} catch (e) {
		throw new Err(`Can't parse the file '${path}'.`, { cause: e });
	}
}

export async function writeJson({ path, data }: { path: string; data: unknown }) {
	const content = JSON.stringify(data, null, "\t");

	try {
		await Deno.writeTextFile(path, content, { create: true });
	} catch (e) {
		throw new Err(`Can't write the file '${path}'.`, { cause: e });
	}
}
