import { getType, isArray, isNull } from "~/lib/vtype.ts";
import { remapErr } from "~/lib/err.ts";

export type IterationItem = {
	key: string;
	value: Value;
	depth: number;
};

export type SimpleValue = string | number | boolean | null;
export type CompoundValue = { [key: string]: Value } | Value[];
export type CompoundValueType = "object" | "array";

export type Value = SimpleValue | CompoundValue;

export function isSimpleValue(data: unknown): data is SimpleValue {
	return isNull(data) || ["string", "number", "boolean"].includes(getType(data));
}

export function isCompoundValue(data: unknown): data is CompoundValue {
	return !isSimpleValue(data);
}

export function getCompoundValueType(value: CompoundValue): CompoundValueType {
	return isArray(value) ? "array" : "object";
}

export function toJson(data: unknown): Value {
	try {
		return JSON.parse(JSON.stringify(data));
	} catch (e) {
		throw remapErr(e, `Failed to convert data to JSON: ${e?.toString() ?? "Unknown error"}`);
	}
}

function* createCompoundJsonIterator(data: CompoundValue, depth: number): Generator<IterationItem> {
	for (const [key, value] of Object.entries(data)) {
		yield { key, value, depth };

		if (isCompoundValue(value) && Object.keys(value).length > 0) {
			yield* createCompoundJsonIterator(value, depth + 1);
		}
	}
}

export function iterateCompoundJson(value: CompoundValue) {
	return createCompoundJsonIterator(value, 1);
}
