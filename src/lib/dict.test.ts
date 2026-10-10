import { describe, it } from "node:test";
import { expect } from "@std/expect";

import { Dict } from "./dict.ts";

describe("dict", () => {
	it("base operations", () => {
		const dict = new Dict();

		expect(dict.size).toBe(0);

		dict.set("foo", "bar");
		expect(dict.size).toBe(1);

		expect(dict.get("foo")).toBe("bar");
		expect(dict.getOrDefault("baz", "unknown")).toBe("unknown");

		expect(() => {
			dict.get("baz");
		}).toThrow("Can't get value from dict by key 'baz'.");

		dict.remove("foo");

		expect(dict.size).toBe(0);

		dict.set("foo", "bar");
		expect(dict.has("foo")).toBe(true);
		expect(dict.has("baz")).toBe(false);

		dict.clear();

		expect(dict.size).toBe(0);
	});

	it("isDict", () => {
		expect(Dict.isDict({})).toBe(false);
		expect(Dict.isDict(new Map())).toBe(false);
		expect(Dict.isDict([])).toBe(false);
		expect(Dict.isDict(new Dict())).toBe(true);
	});

	it("fromArray", () => {
		const dict1 = Dict.fromArray([1, 2, 3]);

		expect(dict1.toEntries()).toEqual([
			["0", 1],
			["1", 2],
			["2", 3],
		]);

		const dict2 = Dict.fromArray([1, 2, 3], (value) => String(value));

		expect(dict2.toEntries()).toEqual([
			["1", 1],
			["2", 2],
			["3", 3],
		]);
	});

	it("forEach", () => {
		const dict = Dict.fromRec({ foo: "bar", baz: "qux" });
		const data: string[] = [];

		dict.forEach((value, key) => {
			data.push(value, key);
		});

		expect(data).toEqual(["bar", "foo", "qux", "baz"]);
	});

	it("getOrInsert", () => {
		const dict = Dict.fromEntries([["foo", [1]]]);

		expect(dict.getOrInsert("foo", [])).toEqual([1]);
		expect(dict.getOrInsert("bar", [])).toEqual([]);

		expect(dict.size).toBe(2);

		dict.getOrInsert("baz", []).push(100);

		expect(dict.get("baz")).toEqual([100]);
		expect(dict.size).toBe(3);
	});

	it("find/findK/findE", () => {
		const dict = Dict.fromEntries(Object.entries(["foo", "bar"]));

		expect(dict.find((value) => value === "unknown")).toBe(undefined);
		expect(dict.find((value) => value === "foo")).toBe("foo");
		expect(dict.findK((value) => value === "foo")).toBe("0");
		expect(dict.findE((_, key) => key === "1")).toEqual(["1", "bar"]);
	});

	it("filter", () => {
		const dict = new Dict(new Map([["foo", 1], ["bar", 6], ["baz", 17]]));

		const newDict = dict.filter((value) => value > 10);

		expect(dict !== newDict).toBe(true);
		expect(Dict.isDict(newDict)).toBe(true);

		expect(newDict.size).toBe(1);
	});

	it("pick/omit", () => {
		const dict = Dict.fromRec({ foo: 1, bar: 2, baz: 3 });

		const newDict1 = dict.pick(["foo", "baz", "unknown"]);
		expect(newDict1.toKeys()).toEqual(["foo", "baz"]);
		expect(dict.size).toBe(3);

		const newDict2 = dict.omit(["foo", "baz", "unknown"]);
		expect(newDict2.toKeys()).toEqual(["bar"]);
		expect(dict.size).toBe(3);
	});

	it("map/mapK/mapE", () => {
		const dict = Dict.fromRec({ foo: 1, bar: 2, baz: 3 });

		const newDict1 = dict.map((value, key) => `${value}.${key}`);
		expect(newDict1.toKeys()).toEqual(["foo", "bar", "baz"]);
		expect(newDict1.toArray()).toEqual(["1.foo", "2.bar", "3.baz"]);

		const newDict2 = dict.mapK((value, key) => `${value}-${key}`);
		expect(newDict2.toKeys()).toEqual(["1-foo", "2-bar", "3-baz"]);
		expect(newDict2.toArray()).toEqual([1, 2, 3]);

		const newDict3 = dict.mapE((value, key) => [String(value), key]);
		expect(newDict3.toKeys()).toEqual(["1", "2", "3"]);
		expect(newDict3.toArray()).toEqual(["foo", "bar", "baz"]);
	});

	it("slice", () => {
		const dict = Dict.fromRec({ foo: 1, bar: 2, baz: 3 });

		const newDict1 = dict.slice();
		expect(newDict1.size).toBe(3);
		expect(newDict1 === dict).toBe(false);
		expect(Dict.isDict(newDict1)).toBe(true);

		const newDict2 = dict.slice(1);
		expect(newDict2.size).toBe(2);

		const newDict3 = dict.slice(0, -1);
		expect(newDict3.size).toBe(2);
	});

	it("some/every", () => {
		const dict = Dict.fromRec({ foo: 1, bar: 2, baz: 3 });

		expect(dict.every((value) => value > 0)).toBe(true);
		expect(dict.every((value) => value % 2)).toBe(false);
		expect(dict.some((value) => value % 2)).toBe(true);
		expect(dict.some((value) => value > 20)).toBe(false);
	});

	it("sortK/sortE", () => {
		const dict = Dict.fromRec({ foo: 1, bar: 2, baz: 3 });

		const newDict1 = dict.sortK();
		expect(newDict1.toKeys()).toEqual(["bar", "baz", "foo"]);

		const newDict2 = dict.sortK((a, b) => b.localeCompare(a));
		expect(newDict2.toKeys()).toEqual(["foo", "baz", "bar"]);

		const newDict3 = dict.sortE(([_1, v1], [_2, v2]) => v2 - v1);
		expect(newDict3.toKeys()).toEqual(["baz", "bar", "foo"]);

		expect(dict.toKeys()).toEqual(["foo", "bar", "baz"]);
	});

	it("reduce", () => {
		const dict = Dict.fromRec({ foo: 1, bar: 2, baz: 3 });

		const result1 = dict.reduce((acc, value) => acc + value, 0);
		expect(result1).toBe(6);

		const result2 = dict.reduce((acc, _, key) => acc + key, "");
		expect(result2).toBe("foobarbaz");
	});

	it("fold", () => {
		const dict = Dict.fromRec({ foo: 1, bar: 2, baz: 3 });

		const newDict = dict.fold<string>((acc, value, key) => {
			const newVal = String(value);
			acc.set(`${key}-1`, newVal);
			acc.set(`${key}-2`, newVal);
			return acc;
		});

		expect(newDict.toArray()).toEqual(["1", "1", "2", "2", "3", "3"]);
	});

	it("group", () => {
		const dict = Dict.fromRec({ foo: 1, bar: 2, baz: 3, qux: 4, quux: 5 });

		const newDict1 = dict.group((value) => value > 3 ? ">3" : "<=3");

		expect(newDict1.toRec()).toEqual({
			"<=3": [1, 2, 3],
			">3": [4, 5],
		});

		const newDict2 = dict.group((_, key) => key.startsWith("b") ? "b" : key.startsWith("q") ? "q" : "others");

		expect(newDict2.toRec()).toEqual({
			"others": [1],
			"b": [2, 3],
			"q": [4, 5],
		});
	});

	it("iterators", () => {
		const dict = Dict.fromRec({ foo: 1 });

		expect(dict.keys().toArray()).toEqual(["foo"]);
		expect(dict.values().toArray()).toEqual([1]);
		expect(dict.entries().toArray()).toEqual([["foo", 1]]);
	});

	it("merge", () => {
		const dict = Dict.fromRec({ foo: 1 });

		dict.merge({ bar: 2 }, [["baz", 3]]).merge().merge(new Map([["qux", 4]]), Dict.fromRec({ quux: 5 }));

		expect(dict.toEntries()).toEqual([
			["foo", 1],
			["bar", 2],
			["baz", 3],
			["qux", 4],
			["quux", 5],
		]);
	});

	it("concat", () => {
		const dict = new Dict<number>().merge({ foo: 1 }, [["bar", 2], ["baz", 3]]).merge().merge(
			new Map([["qux", 4]]),
			Dict.fromRec({ quux: 5 }),
		);

		expect(dict.toEntries()).toEqual([
			["foo", 1],
			["bar", 2],
			["baz", 3],
			["qux", 4],
			["quux", 5],
		]);
	});

	it("toArray/toEntries/toKeys/toMap/toRec", () => {
		const dict = Dict.fromRec({ foo: 1 });

		expect(dict.toArray()).toEqual([1]);
		expect(dict.toEntries()).toEqual([["foo", 1]]);
		expect(dict.toKeys()).toEqual(["foo"]);

		const map = dict.toMap();
		expect(map.entries().toArray()).toEqual([["foo", 1]]);

		expect(dict.toRec()).toEqual({ foo: 1 });
	});

	it("toJSON", () => {
		const dict = Dict.fromRec({ foo: 1 });

		const data = JSON.parse(JSON.stringify({ dict }));

		expect(data).toEqual({ dict: { foo: 1 } });
	});
});
