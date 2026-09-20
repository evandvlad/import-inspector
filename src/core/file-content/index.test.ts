import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";

import { FileContent } from "./index.ts";

describe("file-content", () => {
	it("getContent", () => {
		const fileContent = new FileContent({
			value: `import A from "./foo"; export { A };`,
		});

		expect(fileContent.getContent({ start: 0, end: 6 })).toBe("import");
		expect(fileContent.getContent({ start: 7, end: 8 })).toBe("A");
	});

	it("getAsEntries one entry", () => {
		const fileContent = new FileContent({
			value: `import A from "./foo"; export { A };`,
		});

		expect(fileContent.getAsEntries()).toEqual([
			{ line: 1, value: `import A from "./foo"; export { A };`, posSpan: { start: 0, end: 36 } },
		]);
	});

	it("getAsEntries several entries", () => {
		const fileContent = new FileContent({
			value: `
import A from "./foo";
export { A };
			`.trim(),
		});

		expect(fileContent.getAsEntries()).toEqual([
			{ line: 1, value: `import A from "./foo";`, posSpan: { start: 0, end: 22 } },
			{ line: 2, value: `export { A };`, posSpan: { start: 23, end: 36 } },
		]);
	});

	it("getEntries", () => {
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
			{ line: 3, valuecontent: "", posSpan: { start: 46, end: 46 } },
			{ line: 4, value: "export { A, B };", posSpan: { start: 47, end: 63 } },
		];

		expect(fileContent.getEntries({ start: 0, end: 1 })).toEqual([
			entries[0],
		]);

		expect(fileContent.getEntries({ start: 5, end: 15 })).toEqual([
			entries[0],
		]);

		expect(fileContent.getEntries({ start: 0, end: 22 })).toEqual([
			entries[0],
		]);

		expect(fileContent.getEntries({ start: 23, end: 45 })).toEqual([
			entries[1],
		]);

		expect(fileContent.getEntries({ start: 50, end: 63 })).toEqual([
			entries[3],
		]);

		expect(fileContent.getEntries({ start: 50, end: 64000 })).toEqual([
			entries[3],
		]);

		expect(fileContent.getEntries({ start: 120, end: 120000 })).toEqual([]);
	});
});
