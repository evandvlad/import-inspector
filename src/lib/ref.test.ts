import { describe, it } from "node:test";
import { expect } from "@std/expect";

import { DefRef, DefRefCached } from "./ref.ts";

describe("red", () => {
	it("defRef", () => {
		class Foo {
			defRef;
			constructor(id: string, map: Map<string, string>) {
				this.defRef = new DefRef(() => map.get(id));
			}

			get item() {
				return this.defRef.value;
			}
		}

		const map = new Map<string, string>();
		const foo = new Foo("bar", map);

		map.set("bar", "baz");
		expect(foo.item).toBe("baz");

		map.set("bar", "qux");
		expect(foo.item).toBe("qux");
	});

	it("defRefCached", () => {
		class Foo {
			defRefCached;
			constructor(id: string, map: Map<string, string>) {
				this.defRefCached = new DefRefCached(() => map.get(id));
			}

			get item() {
				return this.defRefCached.value;
			}
		}

		const map = new Map<string, string>();
		const foo = new Foo("bar", map);

		map.set("bar", "baz");
		expect(foo.item).toBe("baz");

		map.set("bar", "qux");
		expect(foo.item).toBe("baz");

		foo.defRefCached.clear();
		expect(foo.item).toBe("qux");

		map.set("bar", "baz");
		expect(foo.item).toBe("qux");
	});
});
