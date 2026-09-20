import type { Settings } from "~/settings.ts";

export const minSettings: Settings = {
	rootEntries: [{ path: "C:/foo" }],
	correctUnresolvedDynamicImports: () => Promise.resolve([]),
	reports: [],
	frames: {},
	importRemaps: {},
	preInspect() {},
	postInspect() {},
};

export function createSettings(parts: Partial<Settings> = {}): Settings {
	return {
		...minSettings,
		...parts,
	};
}
