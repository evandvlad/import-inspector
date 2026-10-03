import type { Settings } from "~/settings.ts";

import { collectFiles } from "./files-collector.ts";
import { PathRecProvider } from "./path-rec-provider/index.ts";
import { parseFiles } from "./files-parser.ts";
import { FrameRegistry } from "./frame-registry.ts";
import { buildModules } from "./modules-builder/index.ts";
import { buildPackages } from "./packages-builder.ts";
import { PackageFinder } from "./package-finder/index.ts";
import { PackageEntryPointDetector } from "./package-entry-point-detector/index.ts";
import { AppContext } from "./app-context/index.ts";
import { setTags } from "./tagger/index.ts";
import { lintFunctions } from "./lint-functions/index.ts";
import { lint } from "./linter.ts";

export async function runEngine({ settings }: { settings: Settings }) {
	const { filePaths, files } = await collectFiles({ settings });
	const pathRecProvider = new PathRecProvider({ filePaths });
	const parsingResult = await parseFiles({ settings, files });
	const packageEntryPointDetector = new PackageEntryPointDetector({ pathRecProvider });
	const packageFinder = new PackageFinder({ pathRecProvider, packageEntryPointDetector });
	const frameRegistry = new FrameRegistry({ pathRecProvider, settings });

	const modules = buildModules({
		parsingResult,
		packageFinder,
		packageEntryPointDetector,
		pathRecProvider,
		frameRegistry,
		settings,
	});

	const packages = buildPackages({ pathRecProvider, packageFinder, modules });
	const appContext = new AppContext({ settings, modules, packages, pathRecProvider, frameRegistry });

	setTags({ appContext });
	await lint({ appContext, lintFunctions, settings });

	return appContext;
}
