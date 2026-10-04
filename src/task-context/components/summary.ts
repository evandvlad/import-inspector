import { components } from "~/clix/index.ts";
import { version } from "~/values.ts";
import type { Settings } from "~/settings.ts";
import type { AppContext } from "~/api.ts";

const { text, link, lines } = components;

function ln(caption: string, content: string | number) {
	return `${text(caption, { bold: true })}: ${content}`;
}

export function createSummary(
	{ settings, appContext }: { settings: Settings; appContext: AppContext },
) {
	const summary = appContext.getSummary();
	const dynamicImports = appContext.imports.getDynamic().length;
	const staticImports = appContext.imports.getStatic().length;

	const modulesInfo = Map.groupBy(appContext.modules.getAll(), ({ lang }) => lang)
		.entries()
		.map(([lang, items]) => `${lang}: ${items.length}`)
		.toArray()
		.join(", ");

	const hrWidth = 75;

	const items = [
		"=".repeat(hrWidth),
		ln("Program version", version),
		ln("Preset", settings.preset.name),
		ln("Settings", link(settings.preset.settingsPath)),
		ln("Project path", settings.preset.projectPath),
		"-".repeat(hrWidth),
		ln("Tags", summary.tags),
		ln("Frames", summary.frames),
		ln("Packages", summary.packages),
		ln("Modules", `${summary.modules} (${modulesInfo})`),
		ln("Imports", `${summary.imports} (static: ${staticImports}, dynamic: ${dynamicImports})`),
		ln("Defects", `${summary.totalDefects} (imports: ${summary.importDefects}, modules: ${summary.moduleDefects})`),
		ln("Unresolved imports", appContext.imports.getFullUnresolved().length),
	];

	if (settings.reportPaths.length > 0) {
		items.push(
			"-".repeat(hrWidth),
			ln("Reports", ""),
			...settings.reportPaths.map((path) => `  ${link(path)}`),
		);
	}

	return lines(items);
}
