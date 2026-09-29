import { unify } from "~/lib/upath.ts";
import type { ConfigPreset, Settings as ISettings } from "~/api.ts";

export class Settings {
	preset;
	frames;
	reports;
	preInspect;
	postInspect;
	rootEntries;
	importRemaps;
	correctUnresolvedDynamicImports;

	constructor({ data, preset }: { data: ISettings; preset: ConfigPreset }) {
		this.preset = preset;

		const {
			rootEntries,
			reports = [],
			frames = {},
			importRemaps = {},
			preInspect = () => {},
			postInspect = () => {},
			correctUnresolvedDynamicImports = () => Promise.resolve([]),
		} = data;

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
