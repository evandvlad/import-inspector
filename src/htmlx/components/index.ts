import type { HtmlxComponents } from "~/api.ts";

import { link } from "./link.ts";
import { dl } from "./dl.ts";
import { details } from "./details.ts";
import { ol } from "./ol.ts";
import { ul } from "./ul.ts";
import { grid } from "./grid.ts";
import { table } from "./table.ts";
import { expander } from "./expander.ts";
import { tabs } from "./tabs.ts";
import { code } from "./code.ts";
import { json } from "./json.ts";
import { yaml } from "./yaml.ts";

export const components = {
	dl,
	ol,
	ul,
	link,
	details,
	table,
	grid,
	expander,
	tabs,
	code,
	json,
	yaml,
} satisfies HtmlxComponents;
