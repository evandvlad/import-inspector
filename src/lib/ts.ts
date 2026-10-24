export type MaybePromise<T> = T | Promise<T>;

export type Nullable<T> = T | null;

export type FnEmpty = () => void;

export function assertNever(value: never): never {
	throw new TypeError(`Unexpected value: ${value}`);
}
