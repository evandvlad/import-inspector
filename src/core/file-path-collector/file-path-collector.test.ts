import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";

import { createConfig } from "../testing/config-maker.ts";

import { collectFilePaths } from "./file-path-collector.ts";

describe("file-path-collector", () => {
	it("globs are correct and file duplicates are excluded", async () => {
		const config = createConfig({ rootEntries: [{ path: "C:/foo/bar" }, { path: "C:/foo/baz" }] });

		const globs: string[] = [];

		const filePaths = await collectFilePaths({
			config,
			externals: {
				async *expandGlob(glob) {
					globs.push(glob);

					yield { path: "C:/foo/bar/qux.ts" };
					yield { path: "C:/foo/bar/quux.ts" };
					yield { path: "C:/foo/bar/qux.ts" };
				},
			},
		});

		expect(globs).toEqual([
			"C:/foo/bar/**/*.{js,ts,tsx}",
			"C:/foo/baz/**/*.{js,ts,tsx}",
		]);

		expect(filePaths.length).toBe(2);
	});
});
