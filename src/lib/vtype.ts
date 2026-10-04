type ObjWithProp<T extends object, K extends string> =
	& T
	& {
		[property in K]: K extends keyof T ? NonNullable<T[K]> : unknown;
	};

export function getType(value: unknown) {
	return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
}

export function isString(value: unknown): value is string {
	return typeof value === "string";
}

export function isNumber(value: unknown): value is number {
	return typeof value === "number";
}

export function isUint(value: unknown): value is number {
	return isNumber(value) && Number.isSafeInteger(value) && value >= 0;
}

export function isBoolean(value: unknown): value is boolean {
	return typeof value === "boolean";
}

export function isObject(value: unknown): value is object {
	return typeof value === "object" && value !== null && !isArray(value) && !isMap(value) && !isSet(value);
}

export function isArray(value: unknown): value is Array<unknown> {
	return Array.isArray(value);
}

export function isMap(value: unknown): value is Map<unknown, unknown> {
	return getType(value) === "map";
}

export function isSet(value: unknown): value is Set<unknown> {
	return getType(value) === "set";
}

export function isNullable(value: unknown): value is null | undefined {
	return isNull(value) || isUndefined(value);
}

export function isNonNullable<T>(value: T): value is NonNullable<T> {
	return !isNull(value) && !isUndefined(value);
}

export function isNull(value: unknown): value is null {
	return value === null;
}

export function isUndefined(value: unknown): value is undefined {
	return value === undefined;
}

export function hasProp<T extends object, K extends string>(
	value: T,
	property: K,
): value is ObjWithProp<T, K> {
	return property in value;
}
