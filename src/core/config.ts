import { Err } from "~/lib/err.ts";
import type { ConfigModule } from "~/api.ts";
import { configPath } from "~/env.ts";

import { posixify } from "./lib/path.ts";

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
		const configModule = await import(configPath).catch((e) => {
			throw new Err(`Can't dynamically import config file from '${configPath}'.`, { cause: e });
		});

		return new this(configModule as ConfigModule);
	}

	private constructor(configModule: ConfigModule) {
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

		this.rootEntries = rootEntries.map(({ path, ...rest }) => ({ path: posixify(path), ...rest }));

		this.importRemaps = Object.fromEntries(
			Object.entries(importRemaps).map(([name, path]) => [name, posixify(path)]),
		);

		this.frames = Object.fromEntries(
			Object.entries(frames)
				.map(([name, paths]) => [name, paths.map((path) => posixify(path))]),
		);

		this.logsDir = logsDir && posixify(logsDir);

		this.customLoggers = customLoggers;
		this.preInspect = preInspect;
		this.postInspect = postInspect;
		this.correctUnresolvedDynamicImports = correctUnresolvedDynamicImports;
	}
}
