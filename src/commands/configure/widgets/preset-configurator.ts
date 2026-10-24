import { isAbsolute } from "@std/path";

import { unify } from "~/lib/upath.ts";
import { dirExists, fileExists } from "~/lib/fs.ts";
import { tuix } from "~/tuix/index.ts";
import type { ConfigPreset } from "~/api.d.ts";

type InspectionResult = {
	isValid: boolean;
	newValue: string;
	message?: string;
};

type ValueInspector = (value: string) => Promise<InspectionResult>;

type Params = {
	isUpdateMode: boolean;
	values?: Partial<ConfigPreset>;
	presetNames?: string[];
};

class PresetConfigurator {
	#presetValues;
	#isUpdateMode;
	#presetNames;
	#selectedValueLines: string[];

	constructor({ isUpdateMode, values = {}, presetNames = [] }: Params) {
		this.#isUpdateMode = isUpdateMode;
		this.#presetValues = values;
		this.#presetNames = presetNames;

		this.#selectedValueLines = [];
	}

	async configure(): Promise<ConfigPreset> {
		const nameValue = this.#presetValues.name ?? "";

		const name = this.#isUpdateMode ? nameValue : await this.#askForField({
			label: "Name:",
			value: this.#presetValues.name,
			inspectValue: this.#inspectNameFieldValue,
		});

		this.#selectedValueLines.push(`Name: ${name}`);

		const settingsPath = await this.#askForField({
			label: "Settings path:",
			value: this.#presetValues.settingsPath,
			inspectValue: this.#inspectSettingsPathFieldValue,
		});

		this.#selectedValueLines.push(`Settings path: ${settingsPath}`);

		const projectPath = await this.#askForField({
			label: "Project path:",
			value: this.#presetValues.projectPath,
			inspectValue: this.#inspectProjectPathFieldValue,
		});

		this.#selectedValueLines.push(`Project path: ${projectPath}`);

		return { name, settingsPath, projectPath };
	}

	async #askForField(
		params: { label: string; inspectValue: ValueInspector; value?: string },
		message = "",
	): Promise<string> {
		tuix.clear();
		tuix.print(this.#selectedValueLines);

		if (message) {
			tuix.eprint(message);
		}

		const value = tuix.prompt({ label: params.label, value: params.value ?? "" });
		const result = await params.inspectValue(value);

		if (!result.isValid) {
			return this.#askForField({ ...params, value: result.newValue }, result.message);
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
			newValue: unify(path),
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
			newValue: unify(path),
		};
	};
}

export function configurePreset(params: Params) {
	return new PresetConfigurator(params).configure();
}
