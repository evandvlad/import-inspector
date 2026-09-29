import { join } from "@std/path";

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
	Help = "help",
	Version = "version",
	Configure = "configure",
	Inspect = "inspect",
	WriteApiFile = "write-api-file",
	Unknown = "unknown",
}

export type Command = (params: { args: string[] }) => Promise<void> | void;
