import { Err } from "~/lib/err.ts";
import { unify } from "~/lib/upath.ts";
import type { SettingsModule } from "~/api.ts";

export class Settings {
	frames;
	logsDir?;
	preInspect;
	postInspect;
	rootEntries;
	importRemaps;
	customLoggers;
	correctUnresolvedDynamicImports;

	static async create({ path }: { path: string }) {
		const settingsModule = await import(path).catch((e) => {
			throw new Err(`Can't dynamically import settings file '${path}'.`, { cause: e });
		});

		return new this(settingsModule as SettingsModule);
	}

	private constructor(settingsModule: SettingsModule) {
		const {
			rootEntries,
			logsDir,
			customLoggers = [],
			frames = {},
			importRemaps = {},
			preInspect = () => {},
			postInspect = () => {},
			correctUnresolvedDynamicImports = () => Promise.resolve([]),
		} = settingsModule.default;

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
