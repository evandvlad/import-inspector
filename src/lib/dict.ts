import { assert } from "~/lib/err.ts";
import type { Dict as IDict } from "~/api.ts";
import { isArray, isMap } from "~/lib/vtype.ts";

type Entry<T> = [key: string, value: T];

export class Dict<T> implements IDict<T> {
	#map;

	static isDict<U = unknown>(value: unknown): value is Dict<U> {
		return value instanceof Dict;
	}

	static fromRec<U>(rec: Record<string, U>) {
		return this.fromEntries(Object.entries(rec));
	}

	static fromEntries<U>(entries: Array<Entry<U>>) {
		return new this<U>(new Map(entries));
	}

	static fromArray<U>(arr: U[], mapKey: (value: U, key: number | string) => string = (_, key) => String(key)) {
		const entries = Object.entries(arr).map(([key, value]) => [mapKey(value, key), value] satisfies Entry<U>);
		return this.fromEntries(entries);
	}

	constructor(map: Map<string, T> = new Map()) {
		this.#map = map;
	}

	get size() {
		return this.#map.size;
	}

	has(key: string) {
		return this.#map.has(key);
	}

	set(key: string, value: T) {
		this.#map.set(key, value);
		return this;
	}

	remove(key: string) {
		this.#map.delete(key);
		return this;
	}

	clear() {
		this.#map.clear();
		return this;
	}

	get(key: string) {
		assert(this.has(key), `Can't get value from dict by key '${key}'.`);
		return this.#map.get(key) as T;
	}

	getOrDefault<U = undefined>(key: string, defaultValue: U) {
		if (!this.has(key)) {
			return defaultValue;
		}

		return this.#map.get(key) as T;
	}

	getOrInsert(key: string, value: T) {
		if (this.has(key)) {
			return this.get(key);
		}

		this.set(key, value);

		return value;
	}

	find(callback: (value: T, key: string) => unknown) {
		return this.findE(callback)?.[1];
	}

	findK(callback: (value: T, key: string) => unknown) {
		return this.findE(callback)?.[0];
	}

	findE(callback: (value: T, key: string) => unknown) {
		return this.toEntries().find(([key, value]) => callback(value, key));
	}

	forEach(callback: (value: T, key: string) => void) {
		this.#map.forEach((value, key) => {
			callback(value, key);
		});

		return this;
	}

	filter(callback: (value: T, key: string) => unknown) {
		const map = new Map<string, T>();

		this.#map.forEach((value, key) => {
			if (callback(value, key)) {
				map.set(key, value);
			}
		});

		return new Dict(map);
	}

	pick(keys: string[]) {
		return this.filter((_, key) => keys.includes(key));
	}

	omit(keys: string[]) {
		return this.filter((_, key) => !keys.includes(key));
	}

	map<U>(callback: (value: T, key: string) => U) {
		const map = new Map<string, U>();

		this.#map.forEach((value, key) => {
			map.set(key, callback(value, key));
		});

		return new Dict(map);
	}

	mapK(callback: (value: T, key: string) => string) {
		const map = new Map<string, T>();

		this.#map.forEach((value, key) => {
			map.set(callback(value, key), value);
		});

		return new Dict(map);
	}

	mapE<U>(callback: (value: T, key: string) => Entry<U>) {
		const map = new Map<string, U>();

		this.#map.forEach((value, key) => {
			const [newKey, newValue] = callback(value, key);
			map.set(newKey, newValue);
		});

		return new Dict(map);
	}

	slice(start?: number, end?: number) {
		const entries = this.toEntries().slice(start, end);
		return Dict.fromEntries(entries);
	}

	some(callback: (value: T, key: string) => unknown) {
		return this.toEntries().some(([key, value]) => callback(value, key));
	}

	every(callback: (value: T, key: string) => unknown) {
		return this.toEntries().every(([key, value]) => callback(value, key));
	}

	sortK(callback?: (key1: string, key2: string) => number) {
		const newKeys = this.toKeys().toSorted(callback);
		const map = new Map<string, T>();

		newKeys.forEach((key) => {
			map.set(key, this.get(key));
		});

		return new Dict(map);
	}

	sortE(callback: (entry1: Entry<T>, entry2: Entry<T>) => number) {
		const newEntries = this.toEntries().toSorted(callback);
		return Dict.fromEntries(newEntries);
	}

	reduce<U>(callback: (acc: U, value: T, key: string) => U, init: U) {
		return this.toEntries().reduce((acc, [key, value]) => callback(acc, value, key), init);
	}

	group(callback: (value: T, key: string) => string) {
		return this.reduce((acc, value, key) => {
			const newKey = callback(value, key);
			acc.getOrInsert(newKey, []).push(value);
			return acc;
		}, new Dict<T[]>());
	}

	merge(...args: Array<IDict<T> | Record<string, T> | Map<string, T> | Array<Entry<T>>>) {
		args.forEach((arg) => {
			if (isMap(arg) || Dict.isDict<T>(arg)) {
				arg.forEach((value, key) => {
					this.set(key, value);
				});

				return;
			}

			if (isArray(arg)) {
				arg.forEach(([key, value]) => {
					this.set(key, value);
				});

				return;
			}

			Object.entries(arg).forEach(([key, value]) => {
				this.set(key, value);
			});
		});

		return this;
	}

	concat(...args: Array<IDict<T> | Record<string, T> | Map<string, T> | Array<Entry<T>>>) {
		return this.slice().merge(...args);
	}

	mergeRec(rec: Record<string, T>) {
		Object.entries(rec).forEach(([key, value]) => {
			this.set(key, value);
		});

		return this;
	}

	keys() {
		return this.#map.keys();
	}

	values() {
		return this.#map.values();
	}

	entries() {
		return this.#map.entries();
	}

	toArray() {
		return this.values().toArray();
	}

	toEntries() {
		return this.entries().toArray();
	}

	toKeys() {
		return this.keys().toArray();
	}

	toMap() {
		return new Map(this.entries());
	}

	toRec() {
		return Object.fromEntries(this.entries());
	}

	toJSON() {
		return this.toRec();
	}
}
