import { assertNever } from "~/lib/ts.ts";
import type { Json, ModuleDefect as IModuleDefect, ViewDataMode } from "~/api.ts";

export class ModuleDefect implements IModuleDefect {
	rule;
	sourcePath;
	description;

	info;

	constructor(
		{ rule, sourcePath, description = "" }: {
			rule: string;
			sourcePath: string;
			description?: string;
		},
	) {
		this.rule = rule;
		this.sourcePath = sourcePath;
		this.description = description;

		this.info = `${rule}${description ? ` (${description})` : ""}`;
	}

	toViewData(mode: ViewDataMode = "brief"): Json {
		switch (mode) {
			case "minimal":
				return this.info;

			case "brief":
			case "verbose":
				return {
					info: this.info,
					sourcePath: this.sourcePath,
				};

			default:
				assertNever(mode);
		}
	}
}
