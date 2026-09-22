import type { HtmlxComponents } from "~/api.ts";

import { stringifyCompAttrs } from "./helpers.ts";

function getValue(data: unknown) {
	try {
		return JSON.stringify(data, null, "  ");
	} catch (e) {
		return e;
	}
}

export const json: HtmlxComponents["json"] = (props) => {
	return `<pre ${stringifyCompAttrs({ compClass: "c_json", props })}>${getValue(props.data)}</pre>`;
};
