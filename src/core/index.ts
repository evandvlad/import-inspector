import type { Settings } from "~/settings.ts";

import { collectFilePaths } from "./file-path-collector/index.ts";
import { PathRecProvider } from "./path-rec-provider/index.ts";
import { parseFiles } from "./files-parser.ts";
import { FrameRegistry } from "./frame-registry.ts";
import { buildModules } from "./modules-builder/index.ts";
import { buildPackages } from "./packages-builder.ts";
import { PackageFinder } from "./package-finder/index.ts";
import { PackageEntryPointDetector } from "./package-entry-point-detector/index.ts";
import { Context } from "./context/index.ts";
import { setTags } from "./tagger/index.ts";
import { inspectionHandlers } from "./inspection-handlers/index.ts";
import { inspect } from "./inspector.ts";

export async function run({ settings }: { settings: Settings }) {
	const filePaths = await collectFilePaths({ settings });
	const pathRecProvider = new PathRecProvider({ filePaths });
	const parsingResult = await parseFiles({ settings, filePaths: pathRecProvider.filePaths });
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
	const context = new Context({ settings, modules, packages, pathRecProvider, frameRegistry });

	setTags({ context });
	await inspect({ context, inspectionHandlers, settings });

	return context;
}
