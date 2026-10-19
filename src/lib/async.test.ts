import { describe, it } from "node:test";
import { expect } from "@std/expect";

import { LazyAsyncBox } from "./async.ts";

describe("async", () => {
	it("LazyAsyncBox", async () => {
		let calls = 0;

		const box = new LazyAsyncBox(() => {
			calls += 1;

			return new Promise<string>((resolve) => {
				setTimeout(() => {
					resolve("done");
				});
			});
		});

		expect(calls).toBe(0);

		const result = await Promise.all([box.promise, box.promise, box.promise]);

		expect(result).toEqual(["done", "done", "done"]);

		expect(calls).toBe(1);
	});
});
