import type { ImpexValues as IImpexValues } from "~/api.d.ts";

export class ImpexValues implements IImpexValues {
	vals;
	everything;

	static concat(...args: IImpexValues[]) {
		const values = Array.from(new Set(args.flatMap(({ vals }) => vals)));
		return new this({ values });
	}

	constructor({ values }: { values: string[] }) {
		this.vals = values;
		this.everything = values.includes("*");
	}

	has(value: string) {
		return this.everything ? true : this.hasExact(value);
	}

	hasExact(value: string) {
		return this.vals.includes(value);
	}
}
