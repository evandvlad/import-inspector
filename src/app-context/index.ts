import type { Dict } from "~/lib/dict.ts";
import type { AppContext } from "~/api.ts";
import type { Settings } from "~/settings.ts";
import type { FileParsingResult } from "~/values.ts";

import { AppContext as AppContextV2 } from "./v2/index.ts";

export function createAppContext(params: { settings: Settings; parsingResult: Dict<FileParsingResult> }): AppContext {
	return {
		v2: new AppContextV2(params),
	};
}
