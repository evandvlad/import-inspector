import { tuix } from "~/tuix/index.ts";
import { configFilePath, version } from "~/values.ts";
import type { Settings } from "~/settings.ts";
import type { AppContext } from "~/api.d.ts";

function ln(caption: string, content: string | number) {
	return `${tuix.text(caption, { bold: true })}: ${content}`;
}

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
		ln("Program version", version),
		ln("Preset", settings.preset.name),
		ln("Config", tuix.link(configFilePath)),
		ln("Settings", tuix.link(settings.preset.settingsPath)),
		ln("Project path", settings.preset.projectPath),
		"-".repeat(hrWidth),
		ln("Tags", sum.tags),
		ln("Frames", sum.frames),
		ln("Packages", sum.packs),
		ln("Modules", `${sum.mods} (${modulesInfo})`),
		ln("Imports", `${sum.imps} (static: ${imps.staticById.size}, dynamic: ${imps.dynamicById.size})`),
		ln("Defects", `${sum.totalDefects} (imports: ${sum.impDefects}, modules: ${sum.modDefects})`),
		ln("Unresolved imports", imps.fullUnresolvedById.size),
	];

	if (settings.reportPaths.length > 0) {
		items.push(
			"-".repeat(hrWidth),
			ln("Reports", ""),
			...settings.reportPaths.map((path) => `  ${tuix.link(path)}`),
		);
	}

	return tuix.lines(items);
}
