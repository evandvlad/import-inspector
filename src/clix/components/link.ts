import { toFileUrl } from "@std/path";

import type { ClixComponents } from "~/api.ts";

export const link: ClixComponents["link"] = (path, { text = path, line } = {}) => {
	return `\x1b]8;;${toFileUrl(path)}${line ? `#${line}` : ""}\x1b\\${text}\x1b]8;;\x1b\\`;
};
