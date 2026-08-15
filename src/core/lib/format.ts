import { stringify } from "@std/yaml";

import type { JsonValue } from "~/lib/ts.ts";

export function formatJson(data: JsonValue) {
	return JSON.stringify(data, null, "\t");
}

export function formatYaml(data: JsonValue) {
	return stringify(data, { indent: 4, lineWidth: 120 });
}
