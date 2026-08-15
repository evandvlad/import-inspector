import type { Package } from "~/api.ts";

import type { Module } from "../module.ts";
import type { Context } from "../context/index.ts";

export type EventMap = {
	"main:config-created": [];
	"main:file-path-collecting-started": [];
	"main:file-path-collecting-finished": [filePaths: string[]];
	"main:files-parsing-started": [];
	"files-parser:file-parsed": [filePath: string];
	"main:files-parsing-finished": [];
	"main:modules-building-started": [];
	"main:modules-building-finished": [modules: Module[]];
	"main:packages-building-started": [];
	"main:packages-building-finished": [packages: Package[]];
	"main:tagging-started": [];
	"main:tagging-finished": [];
	"main:inspection-started": [];
	"main:inspection-finished": [context: Context];
	"main:finished": [];
};
