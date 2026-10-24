import { describe, it } from "node:test";
import { expect } from "@std/expect";

import { LazyAsyncBox, loop } from "./async.ts";

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

	describe("loop", () => {
		it("a single iteration", async () => {
			let counts = 0;

			await loop(() => {
				counts += 1;
				return true;
			});

			expect(counts).toBe(1);
		});

		it("several iterations", async () => {
			let counts = 0;

			await loop(() => {
				return new Promise<boolean>((resolve) => {
					setTimeout(() => {
						resolve(++counts > 3);
					});
				});
			});

			expect(counts).toBe(4);
		});
	});
});
