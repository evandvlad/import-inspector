import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";

import { concat, isAbsolute, posixify, shorten, split, stripEnd, stripStart } from "./path.ts";

describe("lib/path", () => {
	it("posixify", () => {
		expect(posixify("C:\\foo\\bar")).toBe("C:/foo/bar");
		expect(posixify("C:\\foo\\bar\\")).toBe("C:/foo/bar/");
		expect(posixify("C://foo/bar/baz")).toBe("C:/foo/bar/baz");
		expect(posixify("C:\\foo\\bar/baz/")).toBe("C:/foo/bar/baz/");
		expect(posixify("C:/foo/bar")).toBe("C:/foo/bar");
		expect(posixify("/foo/bar\\baz/")).toBe("/foo/bar/baz/");
	});

	it("isAbsolute", () => {
		expect(isAbsolute("C:/foo")).toBe(true);
		expect(isAbsolute("W:/foo")).toBe(true);
		expect(isAbsolute("/foo")).toBe(true);
		expect(isAbsolute(":/foo")).toBe(false);
		expect(isAbsolute("AA:/foo")).toBe(false);
		expect(isAbsolute("foo")).toBe(false);
	});

	it("stripStart", () => {
		expect(stripStart("/foo/bar/baz.ts")).toBe("foo/bar/baz.ts");
		expect(stripStart("C:/foo/bar.tsx")).toBe("C:/foo/bar.tsx");
	});

	it("stripEnd", () => {
		expect(stripEnd("C:/foo/bar/")).toBe("C:/foo/bar");
		expect(stripEnd("C:/foo/bar/baz")).toBe("C:/foo/bar/baz");
	});

	it("split", () => {
		expect(split("C:/foo/bar/baz")).toEqual(["C:", "foo", "bar", "baz"]);
		expect(split("C:/foo/bar/")).toEqual(["C:", "foo", "bar"]);
	});

	it("concat", () => {
		expect(concat(["C:", "foo", "bar.d.ts"])).toBe("C:/foo/bar.d.ts");
	});

	it("shorten", () => {
		expect(shorten("C:/foo/bar/baz", "C:/foo")).toBe("bar/baz");
		expect(shorten("C:/foo/bar/baz", "C:/foo/")).toBe("bar/baz");
		expect(shorten("C:/foo/bar/baz", "C:/foo/bar/baz")).toBe("");
	});
});
