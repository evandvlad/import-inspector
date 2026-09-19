export class Err extends Error {
	override name = "Err";
}

export function isErr(value: unknown): value is Err {
	return value instanceof Err;
}

export function assert(value: unknown, message: string): asserts value {
	if (!value) {
		throw new Err(message);
	}
}

export function rethrowErr(message: string) {
	return (e: unknown) => {
		throw remapErr(e, message);
	};
}

export function remapErr(e: unknown, message: string) {
	return new Err(message, { cause: e });
}
