import type { Settings } from "~/settings.ts";

import { PubSub } from "./pub-sub/index.ts";
import { createLogger } from "./logger/index.ts";
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

export type { Context };

export async function run({ settings }: { settings: Settings }) {
	const { pub, sub } = new PubSub();

	const logger = await createLogger({ sub, settings });

	pub.send("main:config-created");

	pub.send("main:file-path-collecting-started");
	const filePaths = await collectFilePaths({ settings });
	pub.send("main:file-path-collecting-finished", filePaths);

	const pathRecProvider = new PathRecProvider({ filePaths });

	pub.send("main:files-parsing-started");
	const parsingResult = await parseFiles({ settings, pub, pathRecProvider });
	pub.send("main:files-parsing-finished");

	pub.send("main:modules-building-started");
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

	pub.send("main:modules-building-finished", modules);

	pub.send("main:packages-building-started");
	const packages = buildPackages({ pathRecProvider, packageFinder, modules });
	pub.send("main:packages-building-finished", packages);

	const context = new Context({ modules, packages, pathRecProvider, frameRegistry });

	pub.send("main:tagging-started");
	setTags({ context });
	pub.send("main:tagging-finished");

	pub.send("main:inspection-started");
	await inspect({ context, settings, inspectionHandlers });
	pub.send("main:inspection-finished", context);

	pub.send("main:finished");

	await logger.uponDone();

	return context;
}
