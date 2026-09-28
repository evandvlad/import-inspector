import { isAbsolute } from "@std/path";

import { assert, isErr, remapErr } from "~/lib/err.ts";
import { fileExists, readFile, writeFile } from "~/lib/file.ts";
import { tab } from "~/lib/text.ts";
import type { ConfigData } from "~/api.ts";
import { configFilePath } from "~/values.ts";

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
		const doesConfigExist = await fileExists(configFilePath);

		if (!doesConfigExist) {
			return null;
		}

		try {
			const content = await readFile(configFilePath);
			const data = JSON.parse(content);
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
		const content = JSON.stringify(data, null, tab);
		await writeFile(configFilePath, content);
	}
}
