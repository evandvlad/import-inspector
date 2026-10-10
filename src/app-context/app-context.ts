import type { AppContext as IAppContext, Dict as IDict, Module, Package } from "~/api.ts";
import type { Settings } from "~/settings.ts";
import { Dict } from "~/lib/dict.ts";

import type { PathRecProvider } from "./path-rec-provider/index.ts";
import { Packages } from "./packages.ts";
import { Imports } from "./imports.ts";
import { Frames } from "./frames.ts";
import { ImportDefects } from "./import-defects.ts";
import { ModuleDefects } from "./module-defects.ts";
import { Env } from "./env.ts";

export class AppContext implements IAppContext {
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
			modules: Dict<Module>;
			packages: Dict<Package>;
			pathRecProvider: PathRecProvider;
		},
	) {
		this.modules = modules;
		this.packages = new Packages({ packages });
		this.env = new Env({ settings, pathRecProvider });
		this.imports = new Imports({ modules: this.modules });
		this.frames = new Frames({ modules: this.modules });
		this.importDefects = new ImportDefects({ imports: this.imports });
		this.moduleDefects = new ModuleDefects({ modules: this.modules });
	}

	get tags() {
		return this.modules.fold<IDict<Module>>((acc, mod) => {
			mod.tags.forEach((tag) => {
				acc.getOrInsert(tag, new Dict<Module>()).set(mod.path, mod);
			});

			return acc;
		});
	}

	get summary() {
		const importDefects = this.importDefects.total;
		const moduleDefects = this.moduleDefects.total;

		return {
			importDefects,
			moduleDefects,
			tags: this.tags.size,
			frames: this.frames.getAll().length,
			packages: this.packages.all.size,
			modules: this.modules.size,
			imports: this.imports.all.size,
			totalDefects: importDefects + moduleDefects,
		};
	}
}
