export type JsonValue =
	| string
	| number
	| boolean
	| null
	| { [key: string]: JsonValue }
	| JsonValue[];

export type JsonData = { [key: string]: JsonValue };

export function assertNever(value: never): never {
	throw new TypeError(`Unexpected value: ${value}`);
}
