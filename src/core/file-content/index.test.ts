import { describe, it } from "node:test";
import { expect } from "@std/expect";

import { FileContent } from "./index.ts";

describe("file-content", () => {
	it("getContentBySpan", () => {
		const fileContent = new FileContent({
			value: `import A from "./foo"; export { A };`,
		});

		expect(fileContent.getContentBySpan({ start: 0, end: 6 })).toBe("import");
		expect(fileContent.getContentBySpan({ start: 7, end: 8 })).toBe("A");
	});

	it("getContentByLineRange", () => {
		const fileContent = new FileContent({
			value: `
				import A from "./foo";
				export { A };
			`,
		});

		expect(fileContent.getContentByLineRange([0])).toBe("");
		expect(fileContent.getContentByLineRange([0, 2])).toBe("");
		expect(fileContent.getContentByLineRange([2])).toBe('\t\t\t\timport A from "./foo";');
		expect(fileContent.getContentByLineRange([2, 3])).toBe('\t\t\t\timport A from "./foo";\n\t\t\t\texport { A };');
	});

	it("one entry", () => {
		const fileContent = new FileContent({
			value: `import A from "./foo"; export { A };`,
		});

		expect(fileContent.entries).toEqual([
			{ line: 1, value: `import A from "./foo"; export { A };`, posSpan: { start: 0, end: 36 } },
		]);
	});

	it("several entries", () => {
		const fileContent = new FileContent({
			value: `
import A from "./foo";
export { A };
			`.trim(),
		});

		expect(fileContent.entries).toEqual([
			{ line: 1, value: `import A from "./foo";`, posSpan: { start: 0, end: 22 } },
			{ line: 2, value: `export { A };`, posSpan: { start: 23, end: 36 } },
		]);
	});

	it("getEntriesBySpan", () => {
		const fileContent = new FileContent({
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

		expect(fileContent.getEntriesBySpan({ start: 0, end: 1 })).toEqual([
			entries[0],
		]);

		expect(fileContent.getEntriesBySpan({ start: 5, end: 15 })).toEqual([
			entries[0],
		]);

		expect(fileContent.getEntriesBySpan({ start: 0, end: 22 })).toEqual([
			entries[0],
		]);

		expect(fileContent.getEntriesBySpan({ start: 25, end: 60 })).toEqual([
			entries[1],
			entries[2],
			entries[3],
		]);

		expect(fileContent.getEntriesBySpan({ start: 50, end: 63 })).toEqual([
			entries[3],
		]);

		expect(fileContent.getEntriesBySpan({ start: 50, end: 64000 })).toEqual([
			entries[3],
		]);

		expect(fileContent.getEntriesBySpan({ start: 120, end: 120000 })).toEqual([]);
	});

	it("getEntriesByLineRange", () => {
		const fileContent = new FileContent({
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

		expect(fileContent.getEntriesByLineRange([0])).toEqual([]);
		expect(fileContent.getEntriesByLineRange([0, 2])).toEqual([]);

		expect(fileContent.getEntriesByLineRange([1])).toEqual([
			entries[0],
		]);

		expect(fileContent.getEntriesByLineRange([2, 4])).toEqual([
			entries[1],
			entries[2],
			entries[3],
		]);

		expect(fileContent.getEntriesByLineRange([4, 100])).toEqual([
			entries[3],
		]);

		expect(fileContent.getEntriesByLineRange([100, 1000])).toEqual([]);
	});
});
