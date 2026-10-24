import type { FnEmpty } from "~/lib/ts.ts";

type Tag = "tags" | "frames" | "imp-defects" | "mod-defects";

const pubSub = new class {
	#subs = new Map<Tag, FnEmpty[]>();

	pub(tags: Tag[]) {
		tags.forEach((tag) => {
			this.#subs.get(tag)?.forEach((sub) => {
				sub();
			});
		});
	}

	sub(tags: Tag[], callback: FnEmpty) {
		tags.forEach((tag) => {
			this.#subs.getOrInsert(tag, []).push(callback);
		});
	}
}();

export function cache(...tags: Tag[]) {
	return function <This extends object, Value>(
		target: (this: This) => Value,
		context: ClassGetterDecoratorContext<This, Value>,
	) {
		const cacheProp = Symbol(`tag-based-cache:${String(context.name)}`);

		if (tags.length > 0) {
			context.addInitializer(function (this: This) {
				pubSub.sub(tags, () => {
					if (Object.hasOwn(this, cacheProp)) {
						Reflect.deleteProperty(this, cacheProp);
					}
				});
			});
		}

		return function (this: This) {
			if (Object.hasOwn(this, cacheProp)) {
				const instance = this as This & Record<symbol, Value>;
				return instance[cacheProp];
			}

			const result = target.call(this);

			Object.defineProperty(this, cacheProp, {
				value: result,
				enumerable: false,
				writable: false,
				configurable: true,
			});

			return result;
		};
	};
}

export function clear(...tags: Tag[]) {
	return function <This extends object, Args extends unknown[], Return>(
		target: (this: This, ...args: Args) => Return,
	) {
		return function (this: This, ...args: Args) {
			const result = target.call(this, ...args);
			pubSub.pub(tags);
			return result;
		};
	};
}
