import { type CompoundValue, getCompoundValueType, isCompoundValue, type SimpleValue, toJson } from "~/lib/json.ts";
import { sanitizeForHtml } from "~/lib/text.ts";
import type { Htmlxc } from "~/api.ts";

import { stringifyCompAttrs } from "../helpers.ts";

function formatSimpleValueToHtml({ key, value }: { key: string; value: SimpleValue }) {
	return `
		<div class="data__item">
			<span class="data__item-key">${key}:</span>
			<span>${sanitizeForHtml(String(value))}</span>
		</div>
	`;
}

function formatCompoundValueToHtml({ key, value }: { key: string; value: CompoundValue }) {
	const size = Object.keys(value).length;

	return `
		<details class="data__item">
			<summary class="data__item-key data__item-key--compound-value">
				${key}: ${getCompoundValueType(value)}(${size})
			</summary>
			<div>
				${size > 0 ? formatToHtml(value) : `<div class="data__empty-value">Empty</div>`}
			</div>
		</details>
	`;
}

function formatToHtml(json: CompoundValue): string {
	const result = Object.entries(json).reduce((acc, [key, value]) => {
		const content = isCompoundValue(value)
			? formatCompoundValueToHtml({ key, value })
			: formatSimpleValueToHtml({ key, value });

		return [acc, content].join("");
	}, "");

	return `<div class="data__block">${result}</div>`;
}

function getContent(value: unknown) {
	const json = toJson(value);

	if (!isCompoundValue(json)) {
		return `${json}`;
	}

	if (Object.keys(json).length === 0) {
		return "No data";
	}

	return formatToHtml(json);
}

export const data: Htmlxc["data"] = (value, options = {}) => {
	const content = getContent(value);

	return `<div ${stringifyCompAttrs({ classes: ["data"], options })}>${content}</div>`;
};
