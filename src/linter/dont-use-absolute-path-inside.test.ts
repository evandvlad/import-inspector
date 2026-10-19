import { describe, it } from "node:test";
import { expect } from "@std/expect";

import { createAndFillAppContext } from "~/testing/app-context-maker.ts";

import { dontUseAbsolutePathInside } from "./dont-use-absolute-path-inside.ts";

describe("dont-use-absolute-path-inside", () => {
	it("not ok for absolute import from the same package", async () => {
		const appContext = await createAndFillAppContext({
			files: {
				"C:/tmp/main.ts": "",
				"C:/foo/bar.ts": "",
				"C:/foo/baz/index.tsx": 'import "@foo/baz/qux";',
				"C:/foo/baz/qux.ts": "",
			},
			aliases: { "@foo/": "C:/foo" },
		});

		dontUseAbsolutePathInside(appContext);

		const paths = appContext.impDefects
			.byRule
			.get("don't-use-absolute-path-inside")
			.map(({ mod }) => mod.path)
			.toArray();

		expect(paths).toEqual(["C:/foo/baz/index.tsx"]);
	});

	it("not ok for absolute import from the ancestor package", async () => {
		const appContext = await createAndFillAppContext({
			files: {
				"C:/tmp/main.ts": "",
				"C:/foo/bar.ts": "",
				"C:/foo/baz/index.tsx": "",
				"C:/foo/baz/qux/index.ts": "",
				"C:/foo/baz/qux/quux/quuux.ts": 'import "@foo/baz";',
			},
			aliases: { "@foo/": "C:/foo" },
		});

		dontUseAbsolutePathInside(appContext);

		const paths = appContext.impDefects
			.byRule
			.get("don't-use-absolute-path-inside")
			.map(({ mod }) => mod.path)
			.toArray();

		expect(paths).toEqual(["C:/foo/baz/qux/quux/quuux.ts"]);
	});

	it("ok for relative", async () => {
		const appContext = await createAndFillAppContext({
			files: {
				"C:/tmp/main.ts": "",
				"C:/foo/bar.ts": "",
				"C:/foo/baz/index.tsx": 'import "./qux";',
				"C:/foo/baz/qux.ts": "",
			},
		});

		dontUseAbsolutePathInside(appContext);

		const paths = appContext.impDefects
			.byRule
			.getOrDefault("don't-use-absolute-path-inside", undefined)
			?.map(({ mod }) => mod.path)
			.toArray();

		expect(paths).toEqual(undefined);
	});

	it("ok for absolute", async () => {
		const appContext = await createAndFillAppContext({
			files: {
				"C:/tmp/main.ts": "",
				"C:/foo/bar.ts": "",
				"C:/foo/baz/index.tsx": "",
				"C:/foo/baz/qux.ts": "",
				"C:/foo/qux/quux.ts": 'import "@foo/baz";',
			},
			aliases: { "@foo/": "C:/foo" },
		});

		dontUseAbsolutePathInside(appContext);

		const paths = appContext.impDefects
			.byRule
			.getOrDefault("don't-use-absolute-path-inside", undefined)
			?.map(({ mod }) => mod.path)
			.toArray();

		expect(paths).toEqual(undefined);
	});
});
