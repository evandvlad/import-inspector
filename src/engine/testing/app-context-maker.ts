import { PathRecProvider } from "../path-rec-provider/index.ts";
import { parseFiles } from "../files-parser.ts";
import { PackageFinder } from "../package-finder/index.ts";
import { PackageEntryPointDetector } from "../package-entry-point-detector/index.ts";
import { FrameRegistry } from "../frame-registry.ts";
import { buildModules } from "../modules-builder/index.ts";
import { buildPackages } from "../packages-builder.ts";
import { setTags } from "../tagger/index.ts";
import { AppContext } from "../app-context/index.ts";

import { createSettings } from "./settings-maker.ts";

function createRootEntries(aliases?: Record<string, string>) {
	if (!aliases) {
		return [{ path: "C:/" }];
	}

	return Object.entries(aliases).map(([alias, path]) => ({ path, alias }));
}

export async function createAppContext({ files, aliases }: {
	files: Record<string, string>;
	aliases?: Record<string, string>;
}) {
	const settings = createSettings({ rootEntries: createRootEntries(aliases) });
	const pathRecProvider = new PathRecProvider({ filePaths: Object.keys(files) });
	const parsingResult = await parseFiles({ settings, files });
	const packageEntryPointDetector = new PackageEntryPointDetector({ pathRecProvider });
	const packageFinder = new PackageFinder({ pathRecProvider, packageEntryPointDetector });
	const frameRegistry = new FrameRegistry({ settings, pathRecProvider });

	const modules = buildModules({
		settings,
		parsingResult,
		packageFinder,
		packageEntryPointDetector,
		pathRecProvider,
		frameRegistry,
	});

	const packages = buildPackages({ pathRecProvider, packageFinder, modules });

	const appContext = new AppContext({ settings, modules, packages, pathRecProvider, frameRegistry });

	setTags({ appContext });

	return appContext;
}
