import { join } from "@std/path";

import denoJson from "../deno.json" with { type: "json" };

const dirname = import.meta.dirname!;
const homedir = Deno.env.get(Deno.build.os === "windows" ? "USERPROFILE" : "HOME");

export const version = denoJson.version;
export const configPath = `${homedir}/.config/import-inspector/config.ts`;
export const typesFile = join(dirname, "./api.ts");
