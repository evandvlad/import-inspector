import { copy, ensureFile, exists } from "@std/fs";

import { remapErr } from "~/lib/err.ts";

export async function createEmptyFile(path: string) {
	try {
		await ensureFile(path);
		await Deno.create(path);
	} catch (e) {
		remapErr(e, `Can't create the empty file '${path}'.`);
	}
}

export async function appendToFile(path: string, content: string) {
	try {
		await Deno.writeTextFile(path, content, { append: true });
	} catch (e) {
		remapErr(e, `Can't append data into the file '${path}'.`);
	}
}

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

export async function copyFile(source: string, dest: string) {
	await copy(source, dest, { overwrite: true });
}

export function fileExists(path: string) {
	return exists(path, { isFile: true });
}
