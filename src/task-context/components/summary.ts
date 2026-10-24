import type { AppContext } from "~/api.d.ts";
import { tuix } from "~/tuix/index.ts";
import { configFilePath, version } from "~/values.ts";
import type { Settings } from "~/settings.ts";

export function summary({ settings, appContext }: { settings: Settings; appContext: AppContext }) {
	const { summary: sum, imps, mods } = appContext;

	const modsInfo = mods
		.group(({ lang }) => lang)
		.map((items, lang) => `${lang}: ${items.size}`)
		.toArray()
		.join(", ");

	const hrWidth = 75;

	const items = [
		"=".repeat(hrWidth),
		tuix.lvLine("Program version", version),
		tuix.lvLine("Preset", settings.preset.name),
		tuix.lvLine("Config", tuix.link(configFilePath)),
		tuix.lvLine("Settings", tuix.link(settings.preset.settingsPath)),
		tuix.lvLine("Project path", settings.preset.projectPath),
		"-".repeat(hrWidth),
		tuix.lvLine("Tags", String(sum.tags)),
		tuix.lvLine("Frames", String(sum.frames)),
		tuix.lvLine("Packs", String(sum.packs)),
		tuix.lvLine("Mods", `${sum.mods} (${modsInfo})`),
		tuix.lvLine("Imps", `${sum.imps} (static: ${imps.staticById.size}, dynamic: ${imps.dynamicById.size})`),
		tuix.lvLine("Defects", `${sum.totalDefects} (imps: ${sum.impDefects}, mods: ${sum.modDefects})`),
		tuix.lvLine("Unresolved imps", String(imps.fullUnresolvedById.size)),
	];

	if (settings.reportPaths.length > 0) {
		items.push(
			"-".repeat(hrWidth),
			tuix.lvLine("Reports", ""),
			...settings.reportPaths.map((path) => `  ${tuix.link(path)}`),
		);
	}

	return tuix.lines(items);
}
