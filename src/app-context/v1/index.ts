import type { Dict } from "~/lib/dict.ts";
import type { Settings } from "~/settings.ts";
import type { FileParsingResult } from "~/values.ts";

import { PathRecProvider } from "./path-rec-provider/index.ts";
import { buildModules } from "./modules-builder/index.ts";
import { buildPackages } from "./packages-builder.ts";
import { PackageFinder } from "./package-finder/index.ts";
import { PackageEntryPointDetector } from "./package-entry-point-detector/index.ts";
import { AppContext } from "./app-context.ts";

export function createAppContext(
	{ settings, parsingResult }: { settings: Settings; parsingResult: Dict<FileParsingResult> },
) {
	const pathRecProvider = new PathRecProvider({ filePaths: parsingResult.toKeys() });
	const packageEntryPointDetector = new PackageEntryPointDetector({ pathRecProvider });
	const packageFinder = new PackageFinder({ pathRecProvider, packageEntryPointDetector });

	const modules = buildModules({
		parsingResult,
		packageFinder,
		packageEntryPointDetector,
		pathRecProvider,
		settings,
	});

	const packages = buildPackages({ pathRecProvider, packageFinder, modules });

	return new AppContext({ settings, modules, packages, pathRecProvider });
}
