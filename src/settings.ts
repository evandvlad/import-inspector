import { rethrowErr } from "~/lib/err.ts";
import { unify } from "~/lib/upath.ts";
import type { SettingsModule } from "~/api.ts";

export class Settings {
	preset;
	frames;
	reports;
	preInspect;
	postInspect;
	rootEntries;
	importRemaps;
	correctUnresolvedDynamicImports;

	static async create({ preset, path }: { preset: string; path: string }) {
		const settingsModule = await import(path).catch(
			rethrowErr(`Can't dynamically import settings file '${path}'. Preset name is '${preset}.'`),
		);

		return new this(settingsModule as SettingsModule, { preset });
	}

	private constructor(settingsModule: SettingsModule, { preset }: { preset: string }) {
		this.preset = preset;

		const {
			rootEntries,
			reports = [],
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

		this.reports = reports;
		this.preInspect = preInspect;
		this.postInspect = postInspect;
		this.correctUnresolvedDynamicImports = correctUnresolvedDynamicImports;
	}
}
