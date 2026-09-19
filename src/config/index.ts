import type { ConfigData } from "~/api.ts";

import { ConfigService } from "./config-service.ts";

const nullConfigData: ConfigData = {
	presets: {},
};

export class Config {
	static async load() {
		const service = new ConfigService();
		const config = await service.load();

		if (!config) {
			await service.save(nullConfigData);
			return new this({ data: nullConfigData, service });
		}

		return new this({ data: config, service });
	}

	data;

	#service;

	private constructor({ data, service }: { data: ConfigData; service: ConfigService }) {
		this.data = data;
		this.#service = service;
	}

	getSettingsPath({ preset }: { preset: string }) {
		if (!Object.hasOwn(this.data.presets, preset)) {
			return null;
		}

		return this.data.presets[preset];
	}

	async setSettingsPath({ path, preset }: { path: string; preset: string }) {
		this.data.presets[preset] = path;
		await this.#service.save(this.data);
	}
}
