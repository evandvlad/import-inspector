import { exists } from "@std/fs";
import { isAbsolute } from "@std/path";

import { assert, isErr, remapErr } from "~/lib/err.ts";
import { readJson, writeJson } from "~/lib/rw-json.ts";
import type { ConfigData } from "~/api.ts";
import { configFilePath } from "~/env.ts";

function assertConfigData(data: unknown): asserts data is ConfigData {
	assert(
		data && typeof data === "object" && "presets" in data && data.presets &&
			typeof data.presets === "object",
		"Config data is in an unpropriate format.",
	);

	for (const [preset, settingsPath] of Object.entries(data.presets)) {
		assert(typeof settingsPath === "string", `The value for the preset '${preset}' must be a string.`);
		assert(isAbsolute(settingsPath), `The value for the preset '${preset}' is not an absolute path.`);
	}
}

export class ConfigService {
	async load() {
		const doesConfigExist = await exists(configFilePath);

		if (!doesConfigExist) {
			return null;
		}

		try {
			const data = await readJson({ path: configFilePath });
			assertConfigData(data);

			return data;
		} catch (e) {
			const messages = [`Can't process the config file. Check the file: ${configFilePath}.`];

			if (isErr(e)) {
				messages.push(e.message);
			}

			throw remapErr(e, messages.join(" "));
		}
	}

	async save(data: ConfigData) {
		await writeJson({ path: configFilePath, data });
	}
}
