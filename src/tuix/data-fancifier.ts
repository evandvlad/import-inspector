import { type CompoundValue, getCompoundValueType, isSimpleValue, type Value } from "~/lib/json.ts";
import { br } from "~/lib/text.ts";

import { text } from "./text.ts";

const indent = "--";

function convertDataToJson(data: unknown): data is Value {
	return JSON.parse(JSON.stringify(data));
}

function getCompoundValueTitle(value: CompoundValue) {
	return `${getCompoundValueType(value)}(${getCompoundValueSize(value)})`;
}

function getCompoundValueSize(value: CompoundValue) {
	return Object.keys(value).length;
}

function fancifyJson(data: CompoundValue, deepLevel: number) {
	let result = "";
	const currentIndent = indent.repeat(deepLevel);

	for (const [key, value] of Object.entries(data)) {
		const isSimpleVal = isSimpleValue(value);

		result += text(currentIndent, { color: "gray", dim: true });
		result += text(`${key}: `, { color: "blue" });
		result += isSimpleVal ? `${value}` : text(getCompoundValueTitle(value), { dim: true });
		result += br;

		if (!isSimpleVal && getCompoundValueSize(value) > 0) {
			result += fancifyJson(value, deepLevel + 1);
		}
	}

	return result;
}

export function fancifyData(data: unknown) {
	try {
		const json = convertDataToJson(data);

		if (isSimpleValue(json)) {
			return String(json);
		}

		if (getCompoundValueSize(json) === 0) {
			return getCompoundValueTitle(json);
		}

		return fancifyJson(json, 0);
	} catch {
		return `${data}`;
	}
}
