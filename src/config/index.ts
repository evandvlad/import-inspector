import { assert } from "~/lib/err.ts";
import { Settings } from "~/settings.ts";
import type { Config as IConfig, ConfigPreset } from "~/api.d.ts";

import { loadConfig, loadSettings, saveConfig } from "./config-service.ts";

export class Config {
	data;

	static async load() {
		const data = await loadConfig();
		return data ? new this(data) : null;
	}

	static async create() {
		const emptyConfigData: IConfig = { presets: {} };

		await saveConfig(emptyConfigData);
		return new this(emptyConfigData);
	}

	private constructor(data: IConfig) {
		this.data = data;
	}

	get presetNames() {
		return Object.keys(this.data.presets);
	}

	async loadSettings(presetName: string) {
		const preset = this.getPreset(presetName);
		const data = await loadSettings(preset);
		return new Settings({ data, preset });
	}

	getPreset(name: string) {
		const preset = this.#findPreset(name);
		assert(preset, `Can't find preset '${name}'. Available presets: '${this.presetNames.join(", ")}'.`);
		return preset;
	}

	async setPreset({ name, ...presetData }: ConfigPreset) {
		this.data.presets[name] = presetData;
		await saveConfig(this.data);
	}

	async removePreset(name: string) {
		delete this.data.presets[name];
		await saveConfig(this.data);
	}

	#findPreset(name: string): ConfigPreset | null {
		const { presets } = this.data;

		if (!Object.hasOwn(presets, name)) {
			return null;
		}

		return { ...presets[name], name };
	}
}
