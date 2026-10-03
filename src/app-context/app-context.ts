import type { AppContext as IAppContext, Json, ViewDataMode } from "~/api.ts";
import type { Settings } from "~/settings.ts";

import type { PathRecProvider } from "./path-rec-provider/index.ts";
import type { Module } from "./module.ts";
import type { Package } from "./package.ts";
import { Modules } from "./modules.ts";
import { Packages } from "./packages.ts";
import { Imports } from "./imports.ts";
import { Tags } from "./tags.ts";
import { Frames } from "./frames.ts";
import { ImportDefects } from "./import-defects.ts";
import { ModuleDefects } from "./module-defects.ts";
import { Env } from "./env.ts";

export class AppContext implements IAppContext {
	tags;
	frames;
	modules;
	imports;
	env;
	packages;
	importDefects;
	moduleDefects;

	constructor(
		{ settings, modules, packages, pathRecProvider }: {
			settings: Settings;
			modules: Module[];
			packages: Package[];
			pathRecProvider: PathRecProvider;
		},
	) {
		this.modules = new Modules({ modules });
		this.packages = new Packages({ packages });
		this.env = new Env({ settings, pathRecProvider });
		this.imports = new Imports({ modules: this.modules });
		this.tags = new Tags({ modules: this.modules });
		this.frames = new Frames({ modules: this.modules });
		this.importDefects = new ImportDefects({ imports: this.imports });
		this.moduleDefects = new ModuleDefects({ modules: this.modules });
	}

	getSummary() {
		const importDefects = this.importDefects.getAll().length;
		const moduleDefects = this.moduleDefects.getAll().length;

		return {
			importDefects,
			moduleDefects,
			tags: this.tags.getAll().length,
			frames: this.frames.getAll().length,
			packages: this.packages.getAll().length,
			modules: this.modules.getAll().length,
			imports: this.imports.getAll().length,
			totalDefects: importDefects + moduleDefects,
		};
	}

	toViewData(mode: ViewDataMode = "brief"): Json {
		const viewData: Json = {
			tags: this.tags.toViewData(mode),
			frames: this.frames.toViewData(mode),
			imports: this.imports.toViewData(mode),
			modules: this.modules.toViewData(mode),
			packages: this.packages.toViewData(mode),
			importDefects: this.importDefects.toViewData(mode),
			moduleDefects: this.moduleDefects.toViewData(mode),
		};

		if (mode === "verbose") {
			viewData.env = this.env.toViewData(mode);
		}

		return viewData;
	}
}
