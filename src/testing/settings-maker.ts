import type { Settings } from "~/settings.ts";

export const minSettings: Settings = {
	preset: { name: "default", settingsPath: "C:/foo-bar-baz.ts", projectPath: "C:/baz-bar-foo" },
	rootEntries: [{ path: "C:/foo" }],
	correctUnresolvedDynamicImports: () => Promise.resolve([]),
	reports: [],
	reportPaths: [],
	frames: {},
	importRemaps: {},
	preLint() {},
	postLint() {},
};

export function createSettings(parts: Partial<Settings> = {}): Settings {
	return {
		...minSettings,
		...parts,
	};
}
