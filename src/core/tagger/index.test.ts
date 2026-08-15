import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";

import { createContext } from "../testing/context-maker.ts";

import { setTags } from "./index.ts";

describe("tagger", () => {
	it("entry point tag", async () => {
		const context = await createContext({
			localFs: {
				"C:/foo/bar/index.entry.ts": "",
				"C:/foo/baz/index.ts": "",
				"C:/foo/baz/main.ts": "",
			},
		});

		setTags({ context });
		const paths = context.tags.getModulesByTag("entry-point").map(({ path }) => path);

		expect(paths).toEqual([
			"C:/foo/bar/index.entry.ts",
		]);
	});

	it("test tag", async () => {
		const context = await createContext({
			localFs: {
				"C:/foo/bar/index.test.js": "",
				"C:/foo/bar/__tests__/index.js": "",
				"C:/foo/baz/index.test.ts": "",
			},
		});

		setTags({ context });
		const paths = context.tags.getModulesByTag("test").map(({ path }) => path);

		expect(paths).toEqual([
			"C:/foo/bar/index.test.js",
			"C:/foo/baz/index.test.ts",
		]);
	});

	it("independent tag", async () => {
		const context = await createContext({
			localFs: {
				"C:/foo/bar/index.test.js": "",
				"C:/foo/bar/index.entry.ts": "",
				"C:/foo/baz/index.test.ts": "",
			},
		});

		setTags({ context });
		const paths = context.tags.getModulesByTag("independent").map(({ path }) => path);

		expect(paths).toEqual([
			"C:/foo/bar/index.test.js",
			"C:/foo/bar/index.entry.ts",
			"C:/foo/baz/index.test.ts",
		]);
	});

	it("declaration tag", async () => {
		const context = await createContext({
			localFs: {
				"C:/foo/bar/index.d.js": "",
				"C:/foo/bar/index.d.tsx": "",
				"C:/foo/baz/index.d.ts": "",
			},
		});

		setTags({ context });
		const paths = context.tags.getModulesByTag("declaration").map(({ path }) => path);

		expect(paths).toEqual([
			"C:/foo/baz/index.d.ts",
		]);
	});
});
