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
