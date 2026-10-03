import { isAbsolute } from "@std/path";

import { dirExists, fileExists } from "~/lib/fs.ts";
import { components, widgets } from "~/clix/index.ts";
import type { ConfigPreset } from "~/api.ts";

const { text } = components;
const { prompt } = widgets;

type InspectionResult = {
	isValid: boolean;
	newValue: string;
	message?: string;
};

type ValueInspector = (value: string) => Promise<InspectionResult>;

export class PresetConfigurator {
	#values;
	#isUpdateMode;
	#presetNames;

	constructor(
		{ isUpdateMode, values = {}, presetNames = [] }: {
			isUpdateMode: boolean;
			values?: Partial<ConfigPreset>;
			presetNames?: string[];
		},
	) {
		this.#isUpdateMode = isUpdateMode;
		this.#values = values;
		this.#presetNames = presetNames;
	}

	async configure(): Promise<ConfigPreset> {
		const nameValue = this.#values.name ?? "";

		const name = this.#isUpdateMode ? nameValue : await this.#askForField({
			label: "Name:",
			value: this.#values.name,
			inspectValue: this.#inspectNameFieldValue,
		});

		const settingsPath = await this.#askForField({
			label: "Settings path:",
			value: this.#values.settingsPath,
			inspectValue: this.#inspectSettingsPathFieldValue,
		});

		const projectPath = await this.#askForField({
			label: "Project path:",
			value: this.#values.projectPath,
			inspectValue: this.#inspectProjectPathFieldValue,
		});

		return { name, settingsPath, projectPath };
	}

	async #askForField(
		params: { label: string; inspectValue: ValueInspector; value?: string },
		attempt = 1,
		message = "",
	): Promise<string> {
		if (attempt > 1) {
			console.clear();
		}

		if (message) {
			console.log(text(message, { color: "red" }));
		}

		const value = prompt({ label: params.label, value: params.value ?? "" });
		const result = await params.inspectValue(value);

		if (!result.isValid) {
			return this.#askForField({ ...params, value: result.newValue }, attempt + 1, result.message);
		}

		return value;
	}

	#inspectNameFieldValue = (value: string) => {
		const val = value.trim();

		if (!val) {
			return Promise.resolve({
				isValid: false,
				message: "Name is empty.",
				newValue: val,
			});
		}

		if (this.#presetNames.includes(val)) {
			return Promise.resolve({
				isValid: false,
				message: "Preset already exists.",
				newValue: val,
			});
		}

		return Promise.resolve({
			isValid: true,
			newValue: val,
		});
	};

	#inspectSettingsPathFieldValue = async (value: string) => {
		const path = value.trim();

		if (!path) {
			return {
				isValid: false,
				newValue: path,
				message: "Path is empty.",
			};
		}

		if (!isAbsolute(path)) {
			return {
				isValid: false,
				newValue: path,
				message: "Path is not absolute.",
			};
		}

		const doesFileExist = await fileExists(path);

		if (!doesFileExist) {
			return {
				isValid: false,
				newValue: path,
				message: "Can't find settings file.",
			};
		}

		return {
			isValid: true,
			newValue: path,
		};
	};

	#inspectProjectPathFieldValue = async (value: string) => {
		const path = value.trim();

		if (!path) {
			return {
				isValid: false,
				newValue: path,
				message: "Path is empty.",
			};
		}

		if (!isAbsolute(path)) {
			return {
				isValid: false,
				newValue: path,
				message: "Path is not absolute.",
			};
		}

		const doesDirExist = await dirExists(path);

		if (!doesDirExist) {
			return {
				isValid: false,
				newValue: path,
				message: "Can't find project directory.",
			};
		}

		return {
			isValid: true,
			newValue: path,
		};
	};
}
