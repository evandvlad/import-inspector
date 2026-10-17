import { tuix } from "~/tuix/index.ts";
import { version } from "~/values.ts";
import type { Settings } from "~/settings.ts";
import type { AppContext } from "~/api.ts";

function ln(caption: string, content: string | number) {
	return `${tuix.text(caption, { bold: true })}: ${content}`;
}

export function createSummary(
	{ settings, appContext }: { settings: Settings; appContext: AppContext },
) {
	const { summary, imps, mods } = appContext.v2;
	const dynamicImports = imps.dynamicById.size;
	const staticImports = imps.staticById.size;

	const modulesInfo = mods.byPath
		.group(({ lang }) => lang)
		.map((items, lang) => `${lang}: ${items.length}`)
		.toArray()
		.join(", ");

	const hrWidth = 75;

	const items = [
		"=".repeat(hrWidth),
		ln("Program version", version),
		ln("Preset", settings.preset.name),
		ln("Settings", tuix.link(settings.preset.settingsPath)),
		ln("Project path", settings.preset.projectPath),
		"-".repeat(hrWidth),
		ln("Tags", summary.tags),
		ln("Frames", summary.frames),
		ln("Packages", summary.packs),
		ln("Modules", `${summary.mods} (${modulesInfo})`),
		ln("Imports", `${summary.imps} (static: ${staticImports}, dynamic: ${dynamicImports})`),
		ln("Defects", `${summary.totalDefects} (imports: ${summary.impDefects}, modules: ${summary.modDefects})`),
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
