import { assert } from "~/lib/err.ts";

export { basename, common, dirname, extname, join, joinGlobs, parse, toFileUrl } from "@std/path/posix";

export function unify(path: string) {
	return path.replaceAll("\\", "/").replaceAll("//", "/");
}

export function isAbsolute(path: string) {
	if (path.startsWith("/")) {
		return true;
	}

	if (/^[A-Z]:\//.test(path)) {
		return true;
	}

	return false;
}

export function stripStart(path: string) {
	return path.startsWith("/") ? path.slice(1) : path;
}

export function stripEnd(path: string) {
	return path.endsWith("/") ? path.slice(0, -1) : path;
}

export function concat(parts: string[]) {
	return parts.join("/");
}

export function split(path: string) {
	return stripEnd(path).split("/");
}

export function shorten(path: string, base: string) {
	assert(
		path.length >= base.length && path.startsWith(base),
		`Can't shorten the path '${path}' with the base '${base}'. There is an invariant violation.`,
	);

	return stripStart(path.slice(base.length));
}
