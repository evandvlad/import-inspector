import { assert } from "~/lib/err.ts";
import { Settings } from "~/settings.ts";
import type { Config as IConfig, ConfigPreset } from "~/api.ts";

import { ConfigService } from "./config-service.ts";

export class Config {
	data;

	#service;

	static async load() {
		const service = new ConfigService();
		const data = await service.loadConfig();
		return data ? new this({ data, service }) : null;
	}

	static async create() {
		const service = new ConfigService();

		const data = { presets: {} };
		await service.saveConfig(data);

		return new this({ data, service });
	}

	private constructor({ data, service }: { data: IConfig; service: ConfigService }) {
		this.data = data;
		this.#service = service;
	}

	get presetNames() {
		return Object.keys(this.data.presets);
	}

	getPreset(name: string) {
		const preset = this.#findPreset(name);
		assert(preset, `Can't find preset with name '${name}'.`);
		return preset;
	}

	async createSettings(presetName: string) {
		const preset = this.getPreset(presetName);
		const data = await this.#service.loadSettings(preset);
		return new Settings({ data, preset });
	}

	async setPreset(preset: ConfigPreset) {
		this.data.presets[preset.name] = preset;
		await this.#service.saveConfig(this.data);
	}

	async removePreset(name: string) {
		delete this.data.presets[name];
		await this.#service.saveConfig(this.data);
	}

	#findPreset(name: string) {
		const { presets } = this.data;

		if (!Object.hasOwn(presets, name)) {
			return null;
		}

		return presets[name];
	}
}
