import { describe, it } from "node:test";
import { expect } from "@std/expect";

import { stringifyCompAttrs } from "./helpers.ts";

describe("helpers", () => {
	describe("stringifyCompAttrs", () => {
		it("empty", () => {
			expect(stringifyCompAttrs({ options: {} })).toBe("");

			expect(
				stringifyCompAttrs({
					options: { classes: [], attrs: {}, styles: {} },
					classes: [],
					attrs: {},
					styles: {},
				}),
			).toBe("");
		});

		it("classes", () => {
			expect(stringifyCompAttrs({ options: { classes: ["foo"] } })).toBe('class="foo"');
			expect(stringifyCompAttrs({ options: { classes: ["foo", "bar", "baz"] } })).toBe('class="foo bar baz"');

			expect(stringifyCompAttrs({ options: { classes: ["foo"] }, classes: ["bar", "baz"] })).toBe(
				'class="bar baz foo"',
			);

			expect(stringifyCompAttrs({ options: { classes: ["foo"] }, classes: ["bar"], attrs: { class: "qux" } }))
				.toBe(
					'class="qux"',
				);
		});

		it("attrs", () => {
			expect(stringifyCompAttrs({ options: { attrs: { type: "submit" } } })).toBe('type="submit"');
			expect(stringifyCompAttrs({ options: { attrs: { type: "submit" } }, attrs: { rel: "button" } })).toBe(
				'type="submit" rel="button"',
			);

			expect(stringifyCompAttrs({ options: { attrs: { type: "submit" } }, attrs: { type: "reset" } })).toBe(
				'type="reset"',
			);
		});

		it("styles", () => {
			expect(stringifyCompAttrs({ options: { styles: { "border-radius": "5px" } } })).toBe(
				'style="border-radius: 5px"',
			);

			expect(stringifyCompAttrs({ options: { styles: { "border-radius": "5px", opacity: "1" } } })).toBe(
				'style="border-radius: 5px; opacity: 1"',
			);

			expect(
				stringifyCompAttrs({
					options: { styles: { "border-radius": "5px", opacity: "1" } },
					styles: { "border-radius": "50%", border: "1px solid black" },
				}),
			).toBe(
				'style="border-radius: 5px; border: 1px solid black; opacity: 1"',
			);

			expect(
				stringifyCompAttrs({
					options: { styles: { "border-radius": "5px", opacity: "1" } },
					styles: { "border-radius": "50%", border: "1px solid black" },
					attrs: { style: "display: none" },
				}),
			).toBe(
				'style="border-radius: 5px; border: 1px solid black; opacity: 1"',
			);
		});

		it("all", () => {
			expect(
				stringifyCompAttrs({
					options: { classes: ["foo"], attrs: { type: "text" }, styles: { color: "red" } },
					classes: ["bar"],
					attrs: { "value": "test" },
					styles: { display: "flex" },
				}),
			).toBe('type="text" class="bar foo" value="test" style="display: flex; color: red"');
		});
	});
});
