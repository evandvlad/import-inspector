import { describe, it } from "node:test";
import { expect } from "@std/expect";

import {
	dedent,
	delines,
	encodeHtml,
	fromLines,
	normalizeBrs,
	toLines,
	withBrBot,
	withBrBoth,
	withBrTop,
	withTab,
} from "./text.ts";

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

	it("delines", () => {
		expect(delines(`foo
			bar
			baz`)).toBe("foo bar baz");

		expect(delines(`foo
			bar
			
			baz`)).toBe("foo bar baz");

		expect(delines(`	foo
			bar
			
			baz`)).toBe("\tfoo bar baz");

		expect(delines(`  foo
			bar
			
			baz  `)).toBe("  foo bar baz  ");

		expect(delines(`
			foo
			bar
			
			baz
			`)).toBe("\t\t\tfoo bar baz\t\t\t");
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

	it("normalizeBrs", () => {
		expect(normalizeBrs("foo\r\nbar\r\n")).toBe("foo\nbar\n");
	});

	it("toLines", () => {
		expect(toLines("\nfoo\nbar\nbaz\n")).toEqual(["", "foo", "bar", "baz", ""]);
	});

	it("withBrBot", () => {
		expect(withBrBot("foo")).toBe("foo\n");
		expect(withBrBot("foo", 3)).toBe("foo\n\n\n");
	});

	it("withBrTop", () => {
		expect(withBrTop("foo")).toBe("\nfoo");
		expect(withBrTop("foo", 4)).toBe("\n\n\n\nfoo");
	});

	it("withBrBoth", () => {
		expect(withBrBoth("foo")).toBe("\nfoo\n");
		expect(withBrBoth("foo", 2)).toBe("\n\nfoo\n\n");
	});

	it("withTab", () => {
		expect(withTab("foo")).toBe("\tfoo");
		expect(withTab("foo", 2)).toBe("\t\tfoo");
	});
});
