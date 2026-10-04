import { join } from "@std/path";

import type { AppContext, FileContent, Span } from "~/api.ts";

import denoJson from "../deno.json" with { type: "json" };

const dirname = import.meta.dirname!;
const homeDir = Deno.env.get(Deno.build.os === "windows" ? "USERPROFILE" : "HOME");

export const version = denoJson.version;
export const configDir = `${homeDir}/.config/import-inspector`;
export const configFilePath = `${configDir}/config.json`;
export const errorLogFilePath = `${configDir}/error.log`;
export const typesFile = join(dirname, "./api.ts");
export const defaultConfigPresetName = "default";

export enum CommandName {
	Lint = "lint",
	Task = "task",
	Help = "help",
	Version = "version",
	Configure = "configure",
	WriteApiFile = "write-api-file",
	Unknown = "unknown",
}

export type Command = (params: { args: string[] }) => Promise<void> | void;

export type ImportRec = {
	// Can be null for dynamic imports
	locator: string | null;
	isDynamic: boolean;
	posSpan: Span;
};

export type FileParsingResult = {
	path: string;
	fileContent: FileContent;
	importRecs: ImportRec[];
};

export type ImportResolution = {
	path: string | null;
	isExternal: boolean;
	isRelative: boolean;
};

export type LintFunction = (appContext: AppContext) => Promise<void> | void;
