import { describe, it } from "node:test";
import { expect } from "@std/expect";

import {
	getType,
	hasProp,
	isArray,
	isBoolean,
	isMap,
	isNonNullable,
	isNull,
	isNullable,
	isNumber,
	isObject,
	isSet,
	isString,
	isUint,
	isUndefined,
} from "./vtype.ts";

describe("vtype", () => {
	it("getType", () => {
		expect(getType("")).toBe("string");
		expect(getType(NaN)).toBe("number");
		expect(getType(Infinity)).toBe("number");
		expect(getType(0)).toBe("number");
		expect(getType(false)).toBe("boolean");
		expect(getType(null)).toBe("null");
		expect(getType(undefined)).toBe("undefined");
		expect(getType({})).toBe("object");
		expect(getType([])).toBe("array");
		expect(getType(new Map())).toBe("map");
		expect(getType(new Set())).toBe("set");
		expect(getType(() => {})).toBe("function");
	});

	it("isString", () => {
		expect(isString(undefined)).toBe(false);
		expect(isString(null)).toBe(false);
		expect(isString({})).toBe(false);

		expect(isString("")).toBe(true);
		expect(isString(`foo`)).toBe(true);
		expect(isString("bar")).toBe(true);
	});

	it("isNumber", () => {
		expect(isNumber(null)).toBe(false);
		expect(isNumber("12")).toBe(false);

		expect(isNumber(NaN)).toBe(true);
		expect(isNumber(Infinity)).toBe(true);
		expect(isNumber(1.5)).toBe(true);
		expect(isNumber(-5)).toBe(true);
		expect(isNumber(0)).toBe(true);
		expect(isNumber(90.0)).toBe(true);
		expect(isNumber(5)).toBe(true);
	});

	it("isUint", () => {
		expect(isUint(null)).toBe(false);
		expect(isUint("12")).toBe(false);
		expect(isUint(NaN)).toBe(false);
		expect(isUint(Infinity)).toBe(false);
		expect(isUint(1.5)).toBe(false);
		expect(isUint(-5)).toBe(false);

		expect(isUint(0)).toBe(true);
		expect(isUint(90.0)).toBe(true);
		expect(isUint(5)).toBe(true);
	});

	it("isBoolean", () => {
		expect(isBoolean(undefined)).toBe(false);
		expect(isBoolean(0)).toBe(false);
		expect(isBoolean(new Boolean(true))).toBe(false);

		expect(isBoolean(true)).toBe(true);
		expect(isBoolean(false)).toBe(true);
	});

	it("isObject", () => {
		expect(isObject(undefined)).toBe(false);
		expect(isObject(null)).toBe(false);
		expect(isObject(function () {})).toBe(false);
		expect(isObject(/\d/)).toBe(true);
		expect(isObject([])).toBe(false);
		expect(isObject(new Map())).toBe(false);
		expect(isObject(new Set())).toBe(false);

		expect(isObject({})).toBe(true);
		expect(isObject({ a: 12 })).toBe(true);
	});

	it("isArray", () => {
		expect(isArray(undefined)).toBe(false);
		expect(isArray(null)).toBe(false);
		expect(isArray({})).toBe(false);
		expect(isArray({ length: 0 })).toBe(false);

		expect(isArray([])).toBe(true);
	});

	it("isMap", () => {
		expect(isMap(undefined)).toBe(false);
		expect(isMap(null)).toBe(false);
		expect(isMap({})).toBe(false);
		expect(isMap({ size: 0 })).toBe(false);
		expect(isMap([])).toBe(false);
		expect(isMap(new Set())).toBe(false);

		expect(isMap(new Map())).toBe(true);
	});

	it("isSet", () => {
		expect(isSet(undefined)).toBe(false);
		expect(isSet(null)).toBe(false);
		expect(isSet({})).toBe(false);
		expect(isSet({ size: 0 })).toBe(false);
		expect(isSet([])).toBe(false);
		expect(isSet(new Map())).toBe(false);

		expect(isSet(new Set())).toBe(true);
	});

	it("isNullable", () => {
		expect(isNullable(0)).toBe(false);
		expect(isNullable(false)).toBe(false);
		expect(isNullable("")).toBe(false);

		expect(isNullable(undefined)).toBe(true);
		expect(isNullable(null)).toBe(true);
	});

	it("isNonNullable", () => {
		expect(isNonNullable(undefined)).toBe(false);
		expect(isNonNullable(null)).toBe(false);

		expect(isNonNullable(0)).toBe(true);
		expect(isNonNullable(false)).toBe(true);
		expect(isNonNullable("")).toBe(true);
	});

	it("isNull", () => {
		expect(isNull(undefined)).toBe(false);
		expect(isNull(0)).toBe(false);
		expect(isNull(false)).toBe(false);
		expect(isNull("")).toBe(false);

		expect(isNull(null)).toBe(true);
	});

	it("isUndefined", () => {
		expect(isUndefined(null)).toBe(false);
		expect(isUndefined(0)).toBe(false);
		expect(isUndefined(false)).toBe(false);
		expect(isUndefined("")).toBe(false);

		expect(isUndefined(undefined)).toBe(true);
	});

	it("has prop", () => {
		expect(hasProp({}, "foo")).toBe(false);

		expect(hasProp({ foo: "bar" }, "foo")).toBe(true);
		expect(hasProp({}, "toString")).toBe(true);
		expect(hasProp([], "length")).toBe(true);
	});
});
