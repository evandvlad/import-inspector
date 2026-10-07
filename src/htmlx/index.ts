import type { HtmlxComponents } from "~/api.ts";

import { h } from "./components/h.ts";
import { elem } from "./components/elem.ts";
import { flex } from "./components/flex.ts";
import { cols } from "./components/cols.ts";
import { link } from "./components/link.ts";
import { details } from "./components/details.ts";
import { table } from "./components/table.ts";
import { expander } from "./components/expander.ts";
import { tabs } from "./components/tabs.ts";
import { tree } from "./components/tree.ts";
import { code } from "./components/code.ts";
import { flist } from "./components/flist.ts";
import { mark } from "./components/mark.ts";
import { data } from "./components/data.ts";

export const components = {
	h,
	elem,
	flex,
	cols,
	link,
	details,
	table,
	expander,
	tabs,
	tree,
	code,
	flist,
	mark,
	data,
} satisfies HtmlxComponents;

export { createHtml } from "./html/index.ts";
