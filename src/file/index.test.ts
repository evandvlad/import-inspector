import { describe, it } from "node:test";
import { expect } from "@std/expect";

import { File } from "./index.ts";

describe("file", () => {
	it("getContentBySpan", () => {
		const file = new File({
			value: `import A from "./foo"; export { A };`,
		});

		expect(file.getContentBySpan({ start: 0, end: 6 })).toBe("import");
		expect(file.getContentBySpan({ start: 7, end: 8 })).toBe("A");
	});

	it("getContentByLineRange", () => {
		const file = new File({
			value: `
				import A from "./foo";
				export { A };
			`,
		});

		expect(file.getContentByLineRange([0])).toBe("");
		expect(file.getContentByLineRange([0, 2])).toBe("");
		expect(file.getContentByLineRange([2])).toBe('\t\t\t\timport A from "./foo";');
		expect(file.getContentByLineRange([2, 3])).toBe('\t\t\t\timport A from "./foo";\n\t\t\t\texport { A };');
	});

	it("one entry", () => {
		const file = new File({
			value: `import A from "./foo"; export { A };`,
		});

		expect(file.entries).toEqual([
			{ line: 1, value: `import A from "./foo"; export { A };`, posSpan: { start: 0, end: 36 } },
		]);
	});

	it("several entries", () => {
		const file = new File({
			value: `
import A from "./foo";
export { A };
			`.trim(),
		});

		expect(file.entries).toEqual([
			{ line: 1, value: `import A from "./foo";`, posSpan: { start: 0, end: 22 } },
			{ line: 2, value: `export { A };`, posSpan: { start: 23, end: 36 } },
		]);
	});

	it("getEntriesBySpan", () => {
		const file = new File({
			value: `
import A from "./foo";
import B from "./bar";

export { A, B };
			`.trim(),
		});

		const entries = [
			{ line: 1, value: `import A from "./foo";`, posSpan: { start: 0, end: 22 } },
			{ line: 2, value: `import B from "./bar";`, posSpan: { start: 23, end: 45 } },
			{ line: 3, value: "", posSpan: { start: 46, end: 46 } },
			{ line: 4, value: "export { A, B };", posSpan: { start: 47, end: 63 } },
		];

		expect(file.getEntriesBySpan({ start: 0, end: 1 })).toEqual([
			entries[0],
		]);

		expect(file.getEntriesBySpan({ start: 5, end: 15 })).toEqual([
			entries[0],
		]);

		expect(file.getEntriesBySpan({ start: 0, end: 22 })).toEqual([
			entries[0],
		]);

		expect(file.getEntriesBySpan({ start: 25, end: 60 })).toEqual([
			entries[1],
			entries[2],
			entries[3],
		]);

		expect(file.getEntriesBySpan({ start: 50, end: 63 })).toEqual([
			entries[3],
		]);

		expect(file.getEntriesBySpan({ start: 50, end: 64000 })).toEqual([
			entries[3],
		]);

		expect(file.getEntriesBySpan({ start: 120, end: 120000 })).toEqual([]);
	});

	it("getEntriesByLineRange", () => {
		const file = new File({
			value: `
import A from "./foo";
import B from "./bar";

export { A, B };
			`.trim(),
		});

		const entries = [
			{ line: 1, value: `import A from "./foo";`, posSpan: { start: 0, end: 22 } },
			{ line: 2, value: `import B from "./bar";`, posSpan: { start: 23, end: 45 } },
			{ line: 3, value: "", posSpan: { start: 46, end: 46 } },
			{ line: 4, value: "export { A, B };", posSpan: { start: 47, end: 63 } },
		];

		expect(file.getEntriesByLineRange([0])).toEqual([]);
		expect(file.getEntriesByLineRange([0, 2])).toEqual([]);

		expect(file.getEntriesByLineRange([1])).toEqual([
			entries[0],
		]);

		expect(file.getEntriesByLineRange([2, 4])).toEqual([
			entries[1],
			entries[2],
			entries[3],
		]);

		expect(file.getEntriesByLineRange([4, 100])).toEqual([
			entries[3],
		]);

		expect(file.getEntriesByLineRange([100, 1000])).toEqual([]);
	});
});
