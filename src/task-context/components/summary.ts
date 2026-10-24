import { tuix } from "~/tuix/index.ts";
import { configFilePath, version } from "~/values.ts";
import type { Settings } from "~/settings.ts";
import type { AppContext } from "~/api.d.ts";

export function summary(
	{ settings, appContext }: { settings: Settings; appContext: AppContext },
) {
	const { summary: sum, imps, mods } = appContext;

	const modulesInfo = mods
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
		tuix.lvLine("Packages", String(sum.packs)),
		tuix.lvLine("Modules", `${sum.mods} (${modulesInfo})`),
		tuix.lvLine("Imports", `${sum.imps} (static: ${imps.staticById.size}, dynamic: ${imps.dynamicById.size})`),
		tuix.lvLine("Defects", `${sum.totalDefects} (imports: ${sum.impDefects}, modules: ${sum.modDefects})`),
		tuix.lvLine("Unresolved imports", String(imps.fullUnresolvedById.size)),
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
