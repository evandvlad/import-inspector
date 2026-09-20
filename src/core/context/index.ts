import type { Context as IContext, Package } from "~/api.ts";

import type { PathRecProvider } from "../path-rec-provider/index.ts";
import type { FrameRegistry } from "../frame-registry.ts";
import type { Module } from "../module.ts";

import { Modules } from "./modules.ts";
import { Packages } from "./packages.ts";
import { Imports } from "./imports.ts";
import { Tags } from "./tags.ts";
import { Frames } from "./frames.ts";
import { ImportDefects } from "./import-defects.ts";
import { ModuleDefects } from "./module-defects.ts";
import { Env } from "./env.ts";

export class Context implements IContext {
	tags;
	frames;
	modules;
	imports;
	env;
	packages;
	importDefects;
	moduleDefects;

	constructor(
		{ modules, packages, pathRecProvider, frameRegistry }: {
			modules: Module[];
			packages: Package[];
			pathRecProvider: PathRecProvider;
			frameRegistry: FrameRegistry;
		},
	) {
		this.modules = new Modules({ modules });
		this.packages = new Packages({ packages });
		this.env = new Env({ pathRecProvider });
		this.imports = new Imports({ modules: this.modules });
		this.tags = new Tags({ modules: this.modules });
		this.frames = new Frames({ frameRegistry, modules: this.modules });
		this.importDefects = new ImportDefects({ imports: this.imports, modules: this.modules });
		this.moduleDefects = new ModuleDefects({ modules: this.modules });
	}
}
