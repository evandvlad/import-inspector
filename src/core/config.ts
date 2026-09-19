import { Err } from "~/lib/err.ts";
import { unify } from "~/lib/upath.ts";
import type { SettingsModule } from "~/api.ts";

const homeDir = Deno.env.get(Deno.build.os === "windows" ? "USERPROFILE" : "HOME");
const legacyConfigPath = `${homeDir}/.config/import-inspector/config.ts`;

export class Config {
	frames;
	logsDir?;
	preInspect;
	postInspect;
	rootEntries;
	importRemaps;
	customLoggers;
	correctUnresolvedDynamicImports;

	static async create() {
		const configModule = await import(legacyConfigPath).catch((e) => {
			throw new Err(`Can't dynamically import config file from '${legacyConfigPath}'.`, { cause: e });
		});

		return new this(configModule as SettingsModule);
	}

	private constructor(configModule: SettingsModule) {
		const {
			rootEntries,
			logsDir,
			customLoggers = [],
			frames = {},
			importRemaps = {},
			preInspect = () => {},
			postInspect = () => {},
			correctUnresolvedDynamicImports = () => Promise.resolve([]),
		} = configModule.default;

		this.rootEntries = rootEntries.map(({ path, ...rest }) => ({ path: unify(path), ...rest }));

		this.importRemaps = Object.fromEntries(
			Object.entries(importRemaps).map(([name, path]) => [name, unify(path)]),
		);

		this.frames = Object.fromEntries(
			Object.entries(frames)
				.map(([name, paths]) => [name, paths.map((path) => unify(path))]),
		);

		this.logsDir = logsDir && unify(logsDir);

		this.customLoggers = customLoggers;
		this.preInspect = preInspect;
		this.postInspect = postInspect;
		this.correctUnresolvedDynamicImports = correctUnresolvedDynamicImports;
	}
}
