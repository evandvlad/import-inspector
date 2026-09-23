import type { HtmlxComponents } from "~/api.ts";

import { h } from "./h.ts";
import { block } from "./block.ts";
import { blocks } from "./blocks.ts";
import { inline } from "./inline.ts";
import { link } from "./link.ts";
import { desc } from "./desc.ts";
import { details } from "./details.ts";
import { list } from "./list.ts";
import { table } from "./table.ts";
import { expander } from "./expander.ts";
import { tabs } from "./tabs.ts";
import { tree } from "./tree.ts";
import { code } from "./code.ts";
import { raw } from "./raw.ts";
import { flist } from "./flist.ts";
import { mark } from "./mark.ts";
import { figure } from "./figure.ts";

export const components = {
	h,
	block,
	blocks,
	inline,
	link,
	list,
	desc,
	details,
	table,
	expander,
	tabs,
	tree,
	code,
	raw,
	flist,
	mark,
	figure,
} satisfies HtmlxComponents;
