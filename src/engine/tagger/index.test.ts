import { describe, it } from "node:test";
import { expect } from "@std/expect";

import { createAppContext } from "../testing/app-context-maker.ts";

import { setTags } from "./index.ts";

describe("tagger", () => {
	it("entry point tag", async () => {
		const appContext = await createAppContext({
			files: {
				"C:/foo/bar/index.entry.ts": "",
				"C:/foo/baz/index.ts": "",
				"C:/foo/baz/main.ts": "",
			},
		});

		setTags({ appContext });
		const paths = appContext.tags.getModulePathsByTag("entry-point");

		expect(paths).toEqual([
			"C:/foo/bar/index.entry.ts",
		]);
	});

	it("test tag", async () => {
		const appContext = await createAppContext({
			files: {
				"C:/foo/bar/index.test.js": "",
				"C:/foo/bar/__tests__/index.js": "",
				"C:/foo/baz/index.test.ts": "",
			},
		});

		setTags({ appContext });
		const paths = appContext.tags.getModulePathsByTag("test");

		expect(paths).toEqual([
			"C:/foo/bar/index.test.js",
			"C:/foo/baz/index.test.ts",
		]);
	});

	it("independent tag", async () => {
		const appContext = await createAppContext({
			files: {
				"C:/foo/bar/index.test.js": "",
				"C:/foo/bar/index.entry.ts": "",
				"C:/foo/baz/index.test.ts": "",
			},
		});

		setTags({ appContext });
		const paths = appContext.tags.getModulePathsByTag("independent");

		expect(paths).toEqual([
			"C:/foo/bar/index.test.js",
			"C:/foo/bar/index.entry.ts",
			"C:/foo/baz/index.test.ts",
		]);
	});

	it("declaration tag", async () => {
		const appContext = await createAppContext({
			files: {
				"C:/foo/bar/index.d.js": "",
				"C:/foo/bar/index.d.tsx": "",
				"C:/foo/baz/index.d.ts": "",
			},
		});

		setTags({ appContext });
		const paths = appContext.tags.getModulePathsByTag("declaration");

		expect(paths).toEqual([
			"C:/foo/baz/index.d.ts",
		]);
	});
});
