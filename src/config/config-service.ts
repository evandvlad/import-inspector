import { assert, isErr, remapErr } from "~/lib/err.ts";
import { fileExists, readFile, writeFile } from "~/lib/fs.ts";
import { hasProp, isObject, isString } from "~/lib/vtype.ts";
import { tab } from "~/lib/text.ts";
import type { Config, ConfigPreset, SettingsModule } from "~/api.ts";
import { configFilePath } from "~/values.ts";

function assertConfigData(data: unknown): asserts data is Config {
	assert(
		isObject(data) && hasProp(data, "presets") && isObject(data.presets),
		"Config data is in unpropriate format.",
	);

	for (const [name, preset] of Object.entries(data.presets)) {
		assert(
			name === preset.name,
			`'name' property for preset '${name}' must be '${name}' but '${preset.name}' was given.`,
		);

		assert(
			isString(preset.settingsPath),
			`'settingsPath' property for preset '${preset.name}' must be string.`,
		);

		assert(
			isString(preset.projectPath),
			`'projectPath' property for preset '${preset.name}' must be string.`,
		);
	}
}

export async function loadConfig() {
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
		const messages = [`Can't process config file. Check file: ${configFilePath}.`];

		if (isErr(e)) {
			messages.push(e.message);
		}

		throw remapErr(e, messages.join(" "));
	}
}

export async function loadSettings(preset: ConfigPreset) {
	const { name, settingsPath } = preset;

	try {
		const settingsModule: SettingsModule = await import(settingsPath);
		return settingsModule.default(preset);
	} catch (e) {
		throw remapErr(e, `Can't dynamically import settings file '${settingsPath}'. Preset name is '${name}.'`);
	}
}

export async function saveConfig(data: Config) {
	const content = JSON.stringify(data, null, tab);
	await writeFile(configFilePath, content);
}
