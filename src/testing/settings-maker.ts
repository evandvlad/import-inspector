import type { Settings } from "~/settings.ts";

export const minSettings: Settings = {
	preset: { name: "default", settingsPath: "C:/foo-bar-baz.ts", projectPath: "C:/baz-bar-foo" },
	rootEntries: [{ path: "C:/foo" }],
	correctUnresolvedDynamicImports: () => Promise.resolve([]),
	tasks: {},
	reports: [],
	reportPaths: [],
	importRemaps: {},
	preLint() {},
	postLint() {},
	findTask() {
		return null;
	},
};

export function createSettings(parts: Partial<Settings> = {}) {
	return {
		...minSettings,
		...parts,
	} as Settings;
}
