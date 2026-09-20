import { join } from "@std/path";

import type { Context, Module, Package } from "~/api.ts";

import denoJson from "../deno.json" with { type: "json" };

const dirname = import.meta.dirname!;
const homeDir = Deno.env.get(Deno.build.os === "windows" ? "USERPROFILE" : "HOME");

export const version = denoJson.version;
export const configDir = `${homeDir}/.config/import-inspector`;
export const configFilePath = `${configDir}/config.json`;
export const mainLogFilePath = `${configDir}/main.log`;
export const typesFile = join(dirname, "./api.ts");
export const defaultConfigPresetName = "default";

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
