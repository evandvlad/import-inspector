import { getType, isArray, isNull } from "~/lib/vtype.ts";

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
