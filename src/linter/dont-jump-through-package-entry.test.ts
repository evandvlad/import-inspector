import { describe, it } from "node:test";
import { expect } from "@std/expect";

import { createAndFillAppContext } from "~/testing/app-context-maker.ts";

import { dontJumpThroughPackageEntry } from "./dont-jump-through-package-entry.ts";

describe("dont-jump-through-package-entry", () => {
	it("not ok for the mod imported from the child pack not via entry point", async () => {
		const appContext = await createAndFillAppContext({
			files: {
				"C:/tmp/main.ts": "",
				"C:/foo/bar.ts": 'import "@foo/baz/qux";',
				"C:/foo/baz/index.tsx": "",
				"C:/foo/baz/qux.ts": "",
			},
			aliases: { "@foo/": "C:/foo" },
		});

		dontJumpThroughPackageEntry(appContext);

		const paths = appContext.impDefects
			.byRule
			.get("don't-jump-through-package-entry")
			.map(({ mod }) => mod.path)
			.toArray();

		expect(paths).toEqual(["C:/foo/bar.ts"]);
	});

	it("not ok for the mod imported from the child pack not via entry point #2 (source is in the pack)", async () => {
		const appContext = await createAndFillAppContext({
			files: {
				"C:/tmp/main.ts": "",
				"C:/foo/index.ts": "",
				"C:/foo/bar.ts": 'import "@foo/baz/qux";',
				"C:/foo/baz/index.tsx": "",
				"C:/foo/baz/qux.ts": "",
			},
			aliases: { "@foo/": "C:/foo" },
		});

		dontJumpThroughPackageEntry(appContext);

		const paths = appContext.impDefects
			.byRule
			.get("don't-jump-through-package-entry")
			.map(({ mod }) => mod.path)
			.toArray();

		expect(paths).toEqual(["C:/foo/bar.ts"]);
	});

	it("not ok for the mod imported from the descendant pack", async () => {
		const appContext = await createAndFillAppContext({
			files: {
				"C:/tmp/main.ts": "",
				"C:/foo/bar.ts": 'import "@foo/baz/quux";',
				"C:/foo/baz/index.tsx": "",
				"C:/foo/baz/qux.ts": "",
				"C:/foo/baz/quux/index.ts": "",
			},
			aliases: { "@foo/": "C:/foo" },
		});

		dontJumpThroughPackageEntry(appContext);

		const paths = appContext.impDefects
			.byRule
			.get("don't-jump-through-package-entry")
			.map(({ mod }) => mod.path)
			.toArray();

		expect(paths).toEqual(["C:/foo/bar.ts"]);
	});

	it("not ok for the mod imported from the descendant pack #2 (source is in the pack)", async () => {
		const appContext = await createAndFillAppContext({
			files: {
				"C:/tmp/main.ts": "",
				"C:/foo/index.ts": "",
				"C:/foo/bar.ts": 'import "@foo/baz/quux";',
				"C:/foo/baz/index.tsx": "",
				"C:/foo/baz/qux.ts": "",
				"C:/foo/baz/quux/index.ts": "",
			},
			aliases: { "@foo/": "C:/foo" },
		});

		dontJumpThroughPackageEntry(appContext);

		const paths = appContext.impDefects
			.byRule
			.get("don't-jump-through-package-entry")
			.map(({ mod }) => mod.path)
			.toArray();

		expect(paths).toEqual(["C:/foo/bar.ts"]);
	});

	it("ok to import from the child mod via entry point", async () => {
		const appContext = await createAndFillAppContext({
			files: {
				"C:/tmp/main.ts": "",
				"C:/foo/bar.ts": 'import "@foo/baz/qux";',
				"C:/foo/baz/qux/index.ts": "",
				"C:/foo/baz/qux/quux.tsx": "",
			},
			aliases: { "@foo/": "C:/foo" },
		});

		dontJumpThroughPackageEntry(appContext);

		const paths = appContext.impDefects
			.byRule
			.getOrDefault("don't-jump-through-package-entry", undefined)
			?.map(({ mod }) => mod.path)
			.toArray();

		expect(paths).toEqual(undefined);
	});

	it("ok to import from the parent mod", async () => {
		const appContext = await createAndFillAppContext({
			files: {
				"C:/tmp/main.ts": "",
				"C:/foo/index.ts": "",
				"C:/foo/bar.ts": "",
				"C:/foo/baz/index.ts": "",
				"C:/foo/baz/qux.tsx": 'import "@foo/bar";',
			},
			aliases: { "@foo/": "C:/foo" },
		});

		dontJumpThroughPackageEntry(appContext);

		const paths = appContext.impDefects
			.byRule
			.getOrDefault("don't-jump-through-package-entry", undefined)
			?.map(({ mod }) => mod.path)
			.toArray();

		expect(paths).toEqual(undefined);
	});

	it("ok to import from the ancestor mod", async () => {
		const appContext = await createAndFillAppContext({
			files: {
				"C:/tmp/main.ts": "",
				"C:/foo/index.ts": "",
				"C:/foo/bar.ts": "",
				"C:/foo/baz/index.ts": "",
				"C:/foo/baz/qux/index.js": "",
				"C:/foo/baz/qux/quux.tsx": 'import "@foo/bar";',
			},
			aliases: { "@foo/": "C:/foo" },
		});

		dontJumpThroughPackageEntry(appContext);

		const paths = appContext.impDefects
			.byRule
			.getOrDefault("don't-jump-through-package-entry", undefined)
			?.map(({ mod }) => mod.path)
			.toArray();

		expect(paths).toEqual(undefined);
	});

	it("ok if both mods are not in the packs", async () => {
		const appContext = await createAndFillAppContext({
			files: {
				"C:/tmp/main.ts": "",
				"C:/foo/bar.ts": 'import "@foo/baz/qux";',
				"C:/foo/baz/qux.tsx": "",
			},
			aliases: { "@foo/": "C:/foo" },
		});

		dontJumpThroughPackageEntry(appContext);

		const paths = appContext.impDefects
			.byRule
			.getOrDefault("don't-jump-through-package-entry", undefined)
			?.map(({ mod }) => mod.path)
			.toArray();

		expect(paths).toEqual(undefined);
	});

	it("ok if both mods are in the same pack", async () => {
		const appContext = await createAndFillAppContext({
			files: {
				"C:/tmp/main.ts": "",
				"C:/foo/index.ts": "",
				"C:/foo/bar.ts": 'import "@foo/baz/qux";',
				"C:/foo/baz/qux.tsx": "",
			},
			aliases: { "@foo/": "C:/foo" },
		});

		dontJumpThroughPackageEntry(appContext);

		const paths = appContext.impDefects
			.byRule
			.getOrDefault("don't-jump-through-package-entry", undefined)
			?.map(({ mod }) => mod.path)
			.toArray();

		expect(paths).toEqual(undefined);
	});
});
