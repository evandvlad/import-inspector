import type { HtmlxComponents } from "~/api.ts";

import { stringify } from "@std/yaml";
import { stringifyCompAttrs } from "./helpers.ts";

function getValue(data: unknown) {
	try {
		return stringify(data, { indent: 2, lineWidth: 180 });
	} catch (e) {
		return e?.toString();
	}
}

export const yaml: HtmlxComponents["yaml"] = (props) => {
	return `<pre ${stringifyCompAttrs({ compClass: "c_yaml", props })}>${getValue(props.data)}</pre>`;
};
