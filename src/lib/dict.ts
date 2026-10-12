import { assert } from "~/lib/err.ts";
import type { Dict as IDict } from "~/api.ts";
import { isArray, isMap } from "~/lib/vtype.ts";
import { type DefRef, DefRefCached } from "~/lib/ref.ts";

type Entry<T> = [key: string, value: T];
type Reducer<T, U = T> = (acc: U, value: T, key: string) => U;
type Collection<T> = IDict<T> | Record<string, T> | Map<string, T> | Array<Entry<T>>;

export class Dict<T> implements IDict<T> {
	#mapDefRef;

	static isDict<U = unknown>(value: unknown): value is Dict<U> {
		return value instanceof Dict;
	}

	static fromRec<U>(rec: Record<string, U>) {
		const defRef = new DefRefCached(() => new Map(Object.entries(rec)));
		return new this<U>(defRef);
	}

	static fromEntries<U>(entries: Array<Entry<U>>) {
		const defRef = new DefRefCached(() => new Map(entries));
		return new this<U>(defRef);
	}

	static fromArray<U>(arr: U[], mapKey: (value: U, key: number | string) => string = (_, key) => String(key)) {
		const defRef = new DefRefCached(() => {
			const entries = Object.entries(arr)
				.map(([key, value]) => [mapKey(value, key), value] satisfies Entry<U>);

			return new Map(entries);
		});

		return new this<U>(defRef);
	}

	static fromMap<U>(map: Map<string, U>) {
		const defRef = new DefRefCached(() => map);
		return new this<U>(defRef);
	}

	static empty<U>() {
		return new this<U>();
	}

	protected constructor(mapDefRef?: DefRef<Map<string, T>>) {
		this.#mapDefRef = mapDefRef ?? new DefRefCached(() => new Map<string, T>());
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

	addOrReduce(key: string, value: T, reducer: Reducer<T>) {
		return this.set(key, this.has(key) ? reducer(this.get(key), value, key) : value);
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
		return this.fold<T>((acc, value, key) => callback(value, key) ? acc.set(key, value) : acc);
	}

	pick(keys: string[]) {
		return this.filter((_, key) => keys.includes(key));
	}

	omit(keys: string[]) {
		return this.filter((_, key) => !keys.includes(key));
	}

	map<U>(callback: (value: T, key: string) => U) {
		return this.fold<U>((acc, value, key) => acc.set(key, callback(value, key)));
	}

	mapK(callback: (value: T, key: string) => string) {
		return this.fold<T>((acc, value, key) => acc.set(callback(value, key), value));
	}

	mapE<U>(callback: (value: T, key: string) => Entry<U>) {
		return this.fold<U>((acc, value, key) => {
			const [newKey, newValue] = callback(value, key);
			return acc.set(newKey, newValue);
		});
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
		return this.toKeys().toSorted(callback).reduce((acc, key) => acc.set(key, this.get(key)), Dict.empty<T>());
	}

	sortE(callback: (entry1: Entry<T>, entry2: Entry<T>) => number) {
		const newEntries = this.toEntries().toSorted(callback);
		return Dict.fromEntries(newEntries);
	}

	reduce<U>(callback: Reducer<T, U>, init: U) {
		return this.toEntries().reduce((acc, [key, value]) => callback(acc, value, key), init);
	}

	fold<U>(callback: (acc: IDict<U>, value: T, key: string) => IDict<U>): IDict<U> {
		return this.reduce<IDict<U>>(callback, Dict.empty<U>());
	}

	group(callback: (value: T, key: string) => string) {
		return this.reduce((acc, value, key) => {
			const newKey = callback(value, key);
			acc.getOrInsert(newKey, []).push(value);
			return acc;
		}, Dict.empty<T[]>());
	}

	merge(collection: Collection<T>, reducer: Reducer<T> = (_, value) => value) {
		this.#eachInCollection(collection, (value, key) => {
			this.addOrReduce(key, value, reducer);
		});

		return this;
	}

	concat(collection: Collection<T>, reducer?: Reducer<T>) {
		return this.slice().merge(collection, reducer);
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

	get #map() {
		return this.#mapDefRef.value;
	}

	#eachInCollection(collection: Collection<T>, callback: (value: T, key: string) => void) {
		if (isMap(collection) || Dict.isDict<T>(collection)) {
			collection.forEach((value, key) => {
				callback(value, key);
			});

			return;
		}

		if (isArray(collection)) {
			collection.forEach(([key, value]) => {
				callback(value, key);
			});

			return;
		}

		Object.entries(collection).forEach(([key, value]) => {
			callback(value, key);
		});
	}
}
