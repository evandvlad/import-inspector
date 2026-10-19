import type { AppContext as IAppContext, Dict } from "~/api.d.ts";
import type { Settings } from "~/settings.ts";
import type { FileParsingResult } from "~/values.ts";

import { buildEntities } from "./entities-builder/index.ts";
import { Env } from "./env.ts";
import { Imports } from "./imports.ts";
import { ContextPackages } from "./context-packages.ts";
import { ContextTags } from "./context-tags.ts";
import { ContextFrames } from "./context-frames.ts";
import { ContextModuleDefects } from "./context-module-defects.ts";
import { ContextImportDefects } from "./context-import-defects.ts";

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
		const { basePath, impDict, modDict, packDict } = buildEntities({ settings, parsingResult });

		this.env = new Env({ basePath, settings });
		this.mods = modDict;
		this.imps = new Imports({ dict: impDict });
		this.packs = new ContextPackages({ dict: packDict });
		this.tags = new ContextTags({ modDict });
		this.frames = new ContextFrames({ modDict });
		this.impDefects = new ContextImportDefects({ impDict });
		this.modDefects = new ContextModuleDefects({ modDict });
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
