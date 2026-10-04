import { type CompoundValue, getCompoundValueType, isSimpleValue, iterateCompoundJson, toJson } from "~/lib/json.ts";
import { br } from "~/lib/text.ts";

import { text } from "./text.ts";

const indent = "--";

function getCompoundValueTitle(value: CompoundValue) {
	return `${getCompoundValueType(value)}(${getCompoundValueSize(value)})`;
}

function getCompoundValueSize(value: CompoundValue) {
	return Object.keys(value).length;
}

export function prettifyData(data: unknown) {
	try {
		const json = toJson(data);

		if (isSimpleValue(json)) {
			return String(json);
		}

		if (getCompoundValueSize(json) === 0) {
			return getCompoundValueTitle(json);
		}

		return iterateCompoundJson(json)
			.map(({ key, value, deep }) => {
				const ind = indent.repeat(deep - 1);

				return [
					text(ind, { color: "gray", dim: true }),
					text(`${key}: `, { color: "blue" }),
					isSimpleValue(value) ? `${value}` : text(getCompoundValueTitle(value), { dim: true }),
				].join("");
			})
			.reduce((a, b) => [a, br, b].join(""));
	} catch {
		return `${data}`;
	}
}
