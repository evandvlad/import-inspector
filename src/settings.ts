import { unify } from "~/lib/upath.ts";
import type { ConfigPreset, Settings as ISettings } from "~/api.ts";

export class Settings {
	preset;
	reports;
	preLint;
	postLint;
	rootEntries;
	importRemaps;
	correctUnresolvedDynamicImports;

	reportPaths;

	constructor({ data, preset }: { data: ISettings; preset: ConfigPreset }) {
		this.preset = preset;

		const {
			rootEntries,
			reports = [],
			importRemaps = {},
			preLint = () => {},
			postLint = () => {},
			correctUnresolvedDynamicImports = () => Promise.resolve([]),
		} = data;

		this.rootEntries = rootEntries.map(({ path, ...rest }) => ({ path: unify(path), ...rest }));

		this.importRemaps = Object.fromEntries(
			Object.entries(importRemaps).map(([name, path]) => [name, unify(path)]),
		);

		this.reports = reports;
		this.preLint = preLint;
		this.postLint = postLint;
		this.correctUnresolvedDynamicImports = correctUnresolvedDynamicImports;

		this.reportPaths = this.reports.map(({ path }) => path);
	}
}
