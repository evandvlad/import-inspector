import type { AppContext, LineRange, Mod, Pack, TaskContextComponents } from "~/api.d.ts";
import type { Settings } from "~/settings.ts";

import { modPathLink } from "./mod-path-link.ts";
import { modInfo } from "./mod-info.ts";
import { modLinks } from "./mod-links.ts";
import { modCode } from "./mod-code.ts";
import { modDefects } from "./mod-defects.ts";
import { packInfo } from "./pack-info.ts";
import { lintResult } from "./lint-result.ts";
import { summary } from "./summary.ts";

export class Components implements TaskContextComponents {
	#appContext;
	#settings;

	constructor({ appContext, settings }: { appContext: AppContext; settings: Settings }) {
		this.#appContext = appContext;
		this.#settings = settings;
	}

	modPathLink(mod: Mod, lineRange?: LineRange) {
		return modPathLink({ mod, lineRange });
	}

	modInfo(mod: Mod) {
		return modInfo({ mod });
	}

	modCode(mod: Mod, lineRange?: LineRange) {
		return modCode({ mod, lineRange });
	}

	modLinks(mod: Mod) {
		return modLinks({ mod });
	}

	modDefects(mod: Mod) {
		return modDefects({ mod });
	}

	packInfo(pack: Pack) {
		return packInfo({ pack });
	}

	lintResult() {
		return lintResult({ appContext: this.#appContext });
	}

	summary() {
		return summary({ appContext: this.#appContext, settings: this.#settings });
	}
}
