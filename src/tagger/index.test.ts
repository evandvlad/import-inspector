import { describe, it } from "node:test";
import { expect } from "@std/expect";

import { createAndFillAppContext } from "../testing/app-context-maker.ts";

import { setTags } from "./index.ts";

describe("tagger", () => {
	it("entry point tag", async () => {
		const appContext = await createAndFillAppContext({
			files: {
				"C:/foo/bar/index.entry.ts": "",
				"C:/foo/baz/index.ts": "",
				"C:/foo/baz/main.ts": "",
			},
		});

		setTags({ appContext });
		const { modPaths } = appContext.tags.get("entry-point");

		expect(modPaths).toEqual([
			"C:/foo/bar/index.entry.ts",
		]);
	});

	it("test tag", async () => {
		const appContext = await createAndFillAppContext({
			files: {
				"C:/foo/bar/index.test.js": "",
				"C:/foo/bar/__tests__/index.js": "",
				"C:/foo/baz/index.test.ts": "",
			},
		});

		setTags({ appContext });
		const { modPaths } = appContext.tags.get("test");

		expect(modPaths).toEqual([
			"C:/foo/bar/index.test.js",
			"C:/foo/baz/index.test.ts",
		]);
	});

	it("independent tag", async () => {
		const appContext = await createAndFillAppContext({
			files: {
				"C:/foo/bar/index.test.js": "",
				"C:/foo/bar/index.entry.ts": "",
				"C:/foo/baz/index.test.ts": "",
			},
		});

		setTags({ appContext });
		const { modPaths } = appContext.tags.get("independent");

		expect(modPaths).toEqual([
			"C:/foo/bar/index.test.js",
			"C:/foo/bar/index.entry.ts",
			"C:/foo/baz/index.test.ts",
		]);
	});

	it("declaration tag", async () => {
		const appContext = await createAndFillAppContext({
			files: {
				"C:/foo/bar/index.d.js": "",
				"C:/foo/bar/index.d.tsx": "",
				"C:/foo/baz/index.d.ts": "",
			},
		});

		setTags({ appContext });
		const { modPaths } = appContext.tags.get("declaration");

		expect(modPaths).toEqual([
			"C:/foo/baz/index.d.ts",
		]);
	});
});
