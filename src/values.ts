import type { Context, Module, Package } from "~/api.ts";

export type CoreEventMap = {
	"core:file-path-collecting-started": [];
	"core:file-path-collecting-finished": [filePaths: string[]];
	"core:files-parsing-started": [];
	"core:files-parser:file-parsed": [filePath: string];
	"core:files-parsing-finished": [];
	"core:modules-building-started": [];
	"core:modules-building-finished": [modules: Module[]];
	"core:packages-building-started": [];
	"core:packages-building-finished": [packages: Package[]];
	"core:tagging-started": [];
	"core:tagging-finished": [];
	"core:inspection-started": [];
	"core:inspection-finished": [context: Context];
	"core:finished": [];
};
