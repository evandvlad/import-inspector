import type { AppContext_v1, Dict, Module_v1, Package_v1 } from "~/api.ts";
import type { Settings } from "~/settings.ts";

import type { PathRecProvider } from "./path-rec-provider/index.ts";
import { Packages } from "./packages.ts";
import { Imports } from "./imports.ts";
import { Frames } from "./frames.ts";
import { Tags } from "./tags.ts";
import { ImportDefects } from "./import-defects.ts";
import { ModuleDefects } from "./module-defects.ts";
import { Env } from "./env.ts";

export class AppContext implements AppContext_v1 {
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
			modules: Dict<Module_v1>;
			packages: Dict<Package_v1>;
			pathRecProvider: PathRecProvider;
		},
	) {
		this.modules = modules;
		this.packages = new Packages({ packages });
		this.env = new Env({ settings, pathRecProvider });
		this.imports = new Imports({ modules: this.modules });
		this.tags = new Tags({ modules: this.modules });
		this.frames = new Frames({ modules: this.modules });
		this.importDefects = new ImportDefects({ imports: this.imports });
		this.moduleDefects = new ModuleDefects({ modules: this.modules });
	}

	get summary() {
		const importDefects = this.importDefects.total;
		const moduleDefects = this.moduleDefects.total;

		return {
			importDefects,
			moduleDefects,
			tags: this.tags.names.length,
			frames: this.frames.names.length,
			packages: this.packages.all.size,
			modules: this.modules.size,
			imports: this.imports.all.size,
			totalDefects: importDefects + moduleDefects,
		};
	}
}
