import { copy, ensureFile, exists } from "@std/fs";

import { remapErr } from "~/lib/err.ts";

export async function writeFile(path: string, content: string) {
	try {
		await ensureFile(path);
		await Deno.writeTextFile(path, content);
	} catch (e) {
		throw remapErr(e, `Can't write to the file '${path}'.`);
	}
}

export async function readFile(path: string) {
	try {
		return await Deno.readTextFile(path);
	} catch (e) {
		throw remapErr(e, `Can't read the file '${path}'.`);
	}
}

export async function removeFile(path: string) {
	try {
		const doesFileExist = await fileExists(path);

		if (!doesFileExist) {
			return;
		}

		return await Deno.remove(path);
	} catch (e) {
		throw remapErr(e, `Can't remove the file '${path}'.`);
	}
}

export async function copyFile(source: string, dest: string) {
	await copy(source, dest, { overwrite: true });
}

export function fileExists(path: string) {
	return exists(path, { isFile: true });
}

export function dirExists(path: string) {
	return exists(path, { isDirectory: true });
}
