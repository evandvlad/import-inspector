import { join, unify } from "~/lib/upath.ts";
import { assert } from "~/lib/err.ts";
import type { MaybePromise, Nullable } from "~/lib/ts.ts";
import type { AppContext, File, Span } from "~/api.d.ts";

import denoJson from "../deno.json" with { type: "json" };

const dirname = import.meta.dirname!;
const homeDir = Deno.env.get(Deno.build.os === "windows" ? "USERPROFILE" : "HOME");

assert(homeDir, "Can't get home directory path.");

export const version = denoJson.version;
export const configDir = unify(`${homeDir}/.config/import-inspector`);
export const configFilePath = `${configDir}/config.json`;
export const errorLogFilePath = `${configDir}/error.log`;
export const typesFileName = "api.d.ts";
export const typesFile = unify(join(dirname, typesFileName));
export const defaultConfigPresetName = "default";

export enum CommandName {
	Lint = "lint",
	Task = "task",
	Help = "help",
	Version = "version",
	Configure = "configure",
	ListTasks = "list-tasks",
	WriteApiFile = "write-api-file",
	Unknown = "unknown",
}

export type Command = (params: { args: string[] }) => MaybePromise<void>;

export type ImpRec = {
	// Can be null for dynamic imports
	locator: Nullable<string>;
	isDynamic: boolean;
	posSpan: Span;
};

export type FileParsingResult = {
	path: string;
	file: File;
	impRecs: ImpRec[];
};

export type ImpResolutionData = {
	path: Nullable<string>;
	isExternal: boolean;
	isRelative: boolean;
};

export type LintFunction = (appContext: AppContext) => MaybePromise<void>;
