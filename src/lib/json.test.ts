import { describe, it } from "node:test";
import { expect } from "@std/expect";

import { getCompoundValueType, isCompoundValue, isSimpleValue, iterateCompoundJson, toJson } from "./json.ts";

describe("json", () => {
	it("isSimpleValue", () => {
		expect(isSimpleValue(null)).toBe(true);
		expect(isSimpleValue("")).toBe(true);
		expect(isSimpleValue(false)).toBe(true);
		expect(isSimpleValue(0)).toBe(true);

		expect(isSimpleValue([])).toBe(false);
		expect(isSimpleValue({})).toBe(false);
	});

	it("isCompoundValue", () => {
		expect(isCompoundValue([])).toBe(true);
		expect(isCompoundValue({})).toBe(true);

		expect(isCompoundValue(null)).toBe(false);
		expect(isCompoundValue("")).toBe(false);
		expect(isCompoundValue(false)).toBe(false);
		expect(isCompoundValue(0)).toBe(false);
	});

	it("getCompoundValueType", () => {
		expect(getCompoundValueType([])).toBe("array");
		expect(getCompoundValueType({})).toBe("object");
	});

	it("toJSON", () => {
		const data = {
			foo: ["bar", "baz"],
			bar: { baz: null },
			baz: new Set(),
		};

		const result = toJson(data);

		expect(result).toEqual({
			foo: ["bar", "baz"],
			bar: { baz: null },
			baz: {},
		});
	});

	it("iterateCompoundJson", () => {
		const data = {
			foo: { bar: [], baz: { qux: { quux: true } } },
			bar: ["baz", "qux"],
			qux: null,
			quux: 123,
		};

		const result = Array.from(iterateCompoundJson(data));

		expect(result).toEqual([
			{
				deep: 1,
				key: "foo",
				value: data.foo,
			},
			{
				deep: 2,
				key: "bar",
				value: data.foo.bar,
			},
			{
				deep: 2,
				key: "baz",
				value: data.foo.baz,
			},
			{
				deep: 3,
				key: "qux",
				value: data.foo.baz.qux,
			},
			{
				deep: 4,
				key: "quux",
				value: data.foo.baz.qux.quux,
			},
			{
				deep: 1,
				key: "bar",
				value: data.bar,
			},
			{
				deep: 2,
				key: "0",
				value: data.bar[0],
			},
			{
				deep: 2,
				key: "1",
				value: data.bar[1],
			},
			{
				deep: 1,
				key: "qux",
				value: data.qux,
			},
			{
				deep: 1,
				key: "quux",
				value: data.quux,
			},
		]);
	});
});
