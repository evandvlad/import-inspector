import { assert, isErr, remapErr } from "~/lib/err.ts";
import { fileExists, readFile, writeFile } from "~/lib/fs.ts";
import { tab } from "~/lib/text.ts";
import type { Config, ConfigPreset, SettingsModule } from "~/api.ts";
import { configFilePath } from "~/values.ts";

function assertConfigData(data: unknown): asserts data is Config {
	assert(
		data && typeof data === "object" && "presets" in data && data.presets &&
			typeof data.presets === "object",
		"Config data is in an unpropriate format.",
	);

	for (const [name, preset] of Object.entries(data.presets)) {
		assert(
			name === preset.name,
			`'name' property for preset '${name}' must be '${name}' but '${preset.name}' was given.`,
		);

		assert(
			typeof preset.settingsPath === "string",
			`'settingsPath' property for preset '${preset.name}' must be string.`,
		);

		assert(
			typeof preset.projectPath === "string",
			`'projectPath' property for preset '${preset.name}' must be string.`,
		);
	}
}

export class ConfigService {
	async loadConfig() {
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

	async loadSettings(preset: ConfigPreset) {
		const { name, settingsPath } = preset;

		try {
			const settingsModule: SettingsModule = await import(settingsPath);
			return settingsModule.default(preset);
		} catch (e) {
			throw remapErr(e, `Can't dynamically import settings file '${settingsPath}'. Preset name is '${name}.'`);
		}
	}

	async saveConfig(data: Config) {
		const content = JSON.stringify(data, null, tab);
		await writeFile(configFilePath, content);
	}
}
