export type SimpleValue = string | number | boolean | null;
export type CompoundValue = { [key: string]: Value } | Value[];
export type CompoundValueType = "object" | "array";

export type Value = SimpleValue | CompoundValue;

export function isSimpleValue(data: unknown): data is SimpleValue {
	return data === null || ["string", "number", "boolean"].includes(typeof data);
}

export function isCompoundValue(data: unknown): data is CompoundValue {
	return !isSimpleValue(data);
}

export function getCompoundValueType(value: CompoundValue): CompoundValueType {
	return Array.isArray(value) ? "array" : "object";
}
