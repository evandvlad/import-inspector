import { describe, it } from "node:test";
import { expect } from "@std/expect";

import { dedent, encodeHtml, fromLines, normalizeBr, toLines, withBr } from "./text.ts";

describe("lib/text", () => {
	it("dedent", () => {
		expect(dedent(`
			foo
			bar
			baz
		`)).toBe("foo\nbar\nbaz");

		expect(dedent(`

			foo
				bar
		baz

		`)).toBe("foo\nbar\nbaz");
	});

	it("encodeHtml", () => {
		expect(encodeHtml("	<div class=\"foo\" id'bar'> & </div>")).toBe(
			"&nbsp;&nbsp;&nbsp;&nbsp;&lt;div class=&quot;foo&quot; id&apos;bar&apos;&gt; &amp; &lt;/div&gt;",
		);
	});

	it("fromLines", () => {
		const value = fromLines(["", "foo", "", "bar", "", ""]);
		expect(value).toBe("\nfoo\n\nbar\n\n");
	});

	it("normalizeBr", () => {
		expect(normalizeBr("foo\r\nbar\r\n")).toBe("foo\nbar\n");
	});

	it("toLines", () => {
		expect(toLines("\nfoo\nbar\nbaz\n")).toEqual(["", "foo", "bar", "baz", ""]);
	});

	it("withBr", () => {
		expect(withBr("foo")).toBe("foo\n");
		expect(withBr("foo", 3)).toBe("foo\n\n\n");
	});
});
