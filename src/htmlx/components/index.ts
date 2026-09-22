import type { HtmlxComponents } from "~/api.ts";

import { link } from "./link.ts";
import { dl } from "./dl.ts";
import { details } from "./details.ts";
import { list } from "./list.ts";
import { grid } from "./grid.ts";
import { table } from "./table.ts";
import { expander } from "./expander.ts";
import { tabs } from "./tabs.ts";
import { code } from "./code.ts";
import { raw } from "./raw.ts";

export const components = {
	dl,
	link,
	list,
	details,
	table,
	grid,
	expander,
	tabs,
	code,
	raw,
} satisfies HtmlxComponents;
