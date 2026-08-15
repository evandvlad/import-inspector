import type { Config } from "../config.ts";

export const minConfig: Config = {
	rootEntries: [{ path: "C:/foo" }],
	correctUnresolvedDynamicImports: () => Promise.resolve([]),
	customLoggers: [],
	frames: {},
	importRemaps: {},
	preInspect() {},
	postInspect() {},
};

export function createConfig(parts: Partial<Config> = {}): Config {
	return {
		...minConfig,
		...parts,
	};
}
