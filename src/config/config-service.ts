import { toFileUrl } from "@std/path";

import { assert, isErr, remapErr } from "~/lib/err.ts";
import { fileExists, readFile, writeFile } from "~/lib/fs.ts";
import { hasProp, isObject, isString } from "~/lib/vtype.ts";
import { tab } from "~/lib/text.ts";
import type { Config, ConfigPreset, SettingsModule } from "~/api.d.ts";
import { configFilePath } from "~/values.ts";

function assertConfigData(data: unknown): asserts data is Config {
	assert(
		isObject(data) && hasProp(data, "presets") && isObject(data.presets),
		"Config data is in invalid format.",
	);

	for (const [name, preset] of Object.entries(data.presets)) {
		assert(
			name === preset.name,
			`Preset name mismatch: expected '${name}', got '${preset.name}'.`,
		);

		assert(
			isString(preset.settingsPath),
			`'settingsPath' property for preset '${preset.name}' must be a string.`,
		);

		assert(
			isString(preset.projectPath),
			`'projectPath' property for preset '${preset.name}' must be a string.`,
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
		const messages = [`Failed to parse config file '${configFilePath}'.`];

		if (isErr(e)) {
			messages.push(e.message);
		}

		throw remapErr(e, messages.join(" "));
	}
}

export async function loadSettings(preset: ConfigPreset) {
	const { name, settingsPath } = preset;

	try {
		const settingsModule: SettingsModule = await import(toFileUrl(settingsPath).toString());
		return settingsModule.default(preset);
	} catch (e) {
		throw remapErr(e, `Failed to import settings file '${settingsPath}' for preset '${name}'.`);
	}
}

export async function saveConfig(data: Config) {
	const content = JSON.stringify(data, null, tab);
	await writeFile(configFilePath, content);
}
