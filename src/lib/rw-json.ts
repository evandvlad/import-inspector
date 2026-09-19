import { remapErr, rethrowErr } from "~/lib/err.ts";

export async function readJson({ path }: { path: string }) {
	const content = await Deno.readTextFile(path).catch(rethrowErr(`Can't read the file '${path}'.`));

	try {
		return JSON.parse(content) as unknown;
	} catch (e) {
		throw remapErr(e, `Can't parse the file '${path}'.`);
	}
}

export async function writeJson({ path, data }: { path: string; data: unknown }) {
	const content = JSON.stringify(data, null, "\t");

	try {
		await Deno.writeTextFile(path, content, { create: true });
	} catch (e) {
		throw remapErr(e, `Can't write the file '${path}'.`);
	}
}
