import type { AppContext as IAppContext, Dict } from "~/api.d.ts";
import type { Settings } from "~/settings.ts";
import type { FileParsingResult } from "~/values.ts";
import { pub } from "~/program-events.ts";

import { buildEntities } from "./entities-builder/index.ts";
import { Env } from "./env.ts";
import { Imps } from "./imps.ts";
import { ContextPacks } from "./context-packs.ts";
import { ContextTags } from "./context-tags.ts";
import { ContextFrames } from "./context-frames.ts";
import { ContextModDefects } from "./context-mod-defects.ts";
import { ContextImpDefects } from "./context-imp-defects.ts";

export class AppContext implements IAppContext {
	env;
	mods;
	imps;
	packs;
	tags;
	frames;
	impDefects;
	modDefects;

	constructor({ settings, parsingResult }: { settings: Settings; parsingResult: Dict<FileParsingResult> }) {
		pub.send("app-context:started");

		const { basePath, impDict, modDict, packDict } = buildEntities({ settings, parsingResult });

		this.env = new Env({ basePath, settings });
		this.mods = modDict;
		this.imps = new Imps({ dict: impDict });
		this.packs = new ContextPacks({ dict: packDict });
		this.tags = new ContextTags({ modDict });
		this.frames = new ContextFrames({ modDict });
		this.impDefects = new ContextImpDefects({ impDict });
		this.modDefects = new ContextModDefects({ modDict });

		pub.send("app-context:finished");
	}

	get summary() {
		const impDefects = this.impDefects.size;
		const modDefects = this.modDefects.size;

		return {
			impDefects,
			modDefects,
			imps: this.imps.size,
			mods: this.mods.size,
			packs: this.packs.all.size,
			tags: this.tags.size,
			frames: this.frames.size,
			totalDefects: impDefects + modDefects,
		};
	}
}
