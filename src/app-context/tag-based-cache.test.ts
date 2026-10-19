import { describe, it } from "node:test";
import { expect } from "@std/expect";

import { cache, clear } from "./tag-based-cache.ts";

describe("tag-based-cache", () => {
	class Test {
		@cache()
		get cachedForever() {
			return {};
		}

		@cache("tags")
		get tags() {
			return {};
		}

		@cache("tags", "frames")
		get tagsAndFrames() {
			return {};
		}

		@clear()
		clearNone() {}

		@clear("tags")
		clearTags() {}

		@clear("tags", "frames")
		clearTagsAndFrames() {}
	}

	it("cache/clear", () => {
		const test = new Test();
		const snap1 = { cachedForever: test.cachedForever, tags: test.tags, tagsAndFrames: test.tagsAndFrames };

		test.clearNone();
		const snap2 = { cachedForever: test.cachedForever, tags: test.tags, tagsAndFrames: test.tagsAndFrames };

		expect(snap1.cachedForever).toBe(snap2.cachedForever);
		expect(snap1.tags).toBe(snap2.tags);
		expect(snap1.tagsAndFrames).toBe(snap2.tagsAndFrames);

		test.clearTags();
		const snap3 = { cachedForever: test.cachedForever, tags: test.tags, tagsAndFrames: test.tagsAndFrames };

		expect(snap2.cachedForever).toBe(snap3.cachedForever);
		expect(snap2.tags).not.toBe(snap3.tags);
		expect(snap2.tagsAndFrames).not.toBe(snap3.tagsAndFrames);

		test.clearTagsAndFrames();
		const snap4 = { cachedForever: test.cachedForever, tags: test.tags, tagsAndFrames: test.tagsAndFrames };

		expect(snap3.cachedForever).toBe(snap4.cachedForever);
		expect(snap3.tags).not.toBe(snap4.tags);
		expect(snap3.tagsAndFrames).not.toBe(snap4.tagsAndFrames);

		test.clearNone();
		const snap5 = { cachedForever: test.cachedForever, tags: test.tags, tagsAndFrames: test.tagsAndFrames };

		expect(snap4.cachedForever).toBe(snap5.cachedForever);
		expect(snap4.tags).toBe(snap5.tags);
		expect(snap4.tagsAndFrames).toBe(snap5.tagsAndFrames);
	});
});
