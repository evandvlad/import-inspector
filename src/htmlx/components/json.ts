import { type CompoundValue, getCompoundValueType, isCompoundValue, type SimpleValue } from "~/lib/json.ts";
import { sanitizeForHtml } from "~/lib/text.ts";
import type { HtmlxComponents } from "~/api.ts";

import { stringifyCompAttrs } from "../helpers.ts";

function formatSimpleValueToHtml({ key, value }: { key: string; value: SimpleValue }) {
	return `
		<div class="json__item">
			<span class="json__item-key">${key}:</span>
			<span>${sanitizeForHtml(String(value))}</span>
		</div>
	`;
}

function formatCompoundValueToHtml({ key, value }: { key: string; value: CompoundValue }) {
	const size = Object.keys(value).length;

	return `
		<details class="json__item">
			<summary class="json__item-key json__item-key--compound-value">
				${key}: ${getCompoundValueType(value)}(${size})
			</summary>
			<div>
				${size > 0 ? formatToHtml(value) : `<div class="json__empty-value">Empty</div>`}
			</div>
		</details>
	`;
}

function formatToHtml(data: CompoundValue): string {
	const value = Object.entries(data).reduce((acc, [key, value]) => {
		const content = isCompoundValue(value)
			? formatCompoundValueToHtml({ key, value })
			: formatSimpleValueToHtml({ key, value });

		return [acc, content].join("");
	}, "");

	return `<div class="json__block">${value}</div>`;
}

function getContent(data: unknown) {
	try {
		const json = JSON.parse(JSON.stringify(data));

		if (!isCompoundValue(json)) {
			return String(json);
		}

		if (Object.keys(json).length === 0) {
			return "No data";
		}

		return formatToHtml(json);
	} catch (e) {
		return e?.toString() ?? "Unknown error";
	}
}

export const json: HtmlxComponents["json"] = (data, options = {}) => {
	const content = getContent(data);

	return `<div ${stringifyCompAttrs({ classes: ["json"], options })}>${content}</div>`;
};
