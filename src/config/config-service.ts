import { exists } from "@std/fs";
import { isAbsolute } from "@std/path";

import { assert, Err, isErr } from "~/lib/err.ts";
import { formatJson } from "~/lib/format.ts";
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

		const content = await Deno.readTextFile(configFilePath).catch((e) => {
			throw new Err(`Can't read the config file from '${configFilePath}'.`, { cause: e });
		});

		try {
			const data = JSON.parse(content);
			assertConfigData(data);

			return data;
		} catch (e) {
			const messages = [`Can't parse the config file. Check the file: ${configFilePath}.`];

			if (isErr(e)) {
				messages.push(e.message);
			}

			throw new Err(messages.join(" "), { cause: e });
		}
	}

	async save(data: ConfigData) {
		try {
			await Deno.writeTextFile(configFilePath, formatJson(data), { create: true });
		} catch (e) {
			throw new Err(`Can't save the config file '${configFilePath}'.`, { cause: e });
		}
	}
}
