import type { ClixComponents, ClixWidgets } from "~/api.ts";

import { text } from "./components/text.ts";
import { link } from "./components/link.ts";
import { lines } from "./components/lines.ts";
import { code } from "./components/code.ts";
import { spin } from "./widgets/spin.ts";
import { confirmWidget } from "./widgets/confirm.ts";
import { promptWidget } from "./widgets/prompt.ts";
import { select } from "./widgets/select.ts";

export const components: ClixComponents = {
	text,
	link,
	code,
	lines,
};

export const widgets: ClixWidgets = {
	spin,
	select,
	confirm: confirmWidget,
	prompt: promptWidget,
};
