import { describe, it } from "node:test";
import { expect } from "@std/expect";

import { createSettings } from "~/testing/settings-maker.ts";

import { Env } from "./env.ts";

describe("env", () => {
	it("toShortPath (win os)", () => {
		const env = new Env({ settings: createSettings(), basePath: "C:/foo" });

		expect(env.toShortPath("C:/foo/bar/baz.ts")).toBe("bar/baz.ts");
		expect(env.toShortPath("bar/baz.ts")).toBe("bar/baz.ts");
		expect(env.toShortPath("index.js")).toBe("index.js");
	});

	it("toShortPath (unix os)", () => {
		const env = new Env({ settings: createSettings(), basePath: "/foo" });

		expect(env.toShortPath("/foo/bar/baz.ts")).toBe("bar/baz.ts");
		expect(env.toShortPath("bar/baz.ts")).toBe("bar/baz.ts");
		expect(env.toShortPath("index.js")).toBe("index.js");
	});

	it("toFullPath (win os)", () => {
		const env = new Env({ settings: createSettings(), basePath: "C:/foo" });

		expect(env.toFullPath("C:/foo/bar/baz.ts")).toBe("C:/foo/bar/baz.ts");
		expect(env.toFullPath("bar/baz.ts")).toBe("C:/foo/bar/baz.ts");
		expect(env.toFullPath("index.js")).toBe("C:/foo/index.js");
	});

	it("toFullPath (unix os)", () => {
		const env = new Env({ settings: createSettings(), basePath: "/foo" });

		expect(env.toFullPath("/foo/bar/baz.ts")).toBe("/foo/bar/baz.ts");
		expect(env.toFullPath("bar/baz.ts")).toBe("/foo/bar/baz.ts");
		expect(env.toFullPath("index.js")).toBe("/foo/index.js");
	});
});
