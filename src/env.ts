import { join } from "@std/path";

import denoJson from "../deno.json" with { type: "json" };

const dirname = import.meta.dirname!;
const homeDir = Deno.env.get(Deno.build.os === "windows" ? "USERPROFILE" : "HOME");
const configDir = `${homeDir}/.config/import-inspector`;

export const version = denoJson.version;
export const configFilePath = `${configDir}/config.json`;
// @TODO remove it later
export const legacyConfigPath = `${homeDir}/.config/import-inspector/config.ts`;
export const typesFile = join(dirname, "./api.ts");
