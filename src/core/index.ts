import { PubSub } from "~/lib/pub-sub.ts";
import type { Settings } from "~/settings.ts";
import type { CoreEventMap } from "~/values.ts";

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

export class CoreRunner {
	sub;

	#settings;
	#pub;

	constructor({ settings }: { settings: Settings }) {
		this.#settings = settings;

		const { pub, sub } = new PubSub<CoreEventMap>();

		this.#pub = pub;
		this.sub = sub;
	}

	async run() {
		const logger = await createLogger({ sub: this.sub, settings: this.#settings });

		this.#pub.send("core:file-path-collecting-started");
		const filePaths = await collectFilePaths({ settings: this.#settings });
		this.#pub.send("core:file-path-collecting-finished", filePaths);

		const pathRecProvider = new PathRecProvider({ filePaths });

		this.#pub.send("core:files-parsing-started");
		const parsingResult = await parseFiles({ pathRecProvider, settings: this.#settings, pub: this.#pub });
		this.#pub.send("core:files-parsing-finished");

		this.#pub.send("core:modules-building-started");
		const packageEntryPointDetector = new PackageEntryPointDetector({ pathRecProvider });
		const packageFinder = new PackageFinder({ pathRecProvider, packageEntryPointDetector });
		const frameRegistry = new FrameRegistry({ pathRecProvider, settings: this.#settings });

		const modules = buildModules({
			parsingResult,
			packageFinder,
			packageEntryPointDetector,
			pathRecProvider,
			frameRegistry,
			settings: this.#settings,
		});

		this.#pub.send("core:modules-building-finished", modules);

		this.#pub.send("core:packages-building-started");
		const packages = buildPackages({ pathRecProvider, packageFinder, modules });
		this.#pub.send("core:packages-building-finished", packages);

		const context = new Context({ modules, packages, pathRecProvider, frameRegistry });

		this.#pub.send("core:tagging-started");
		setTags({ context });
		this.#pub.send("core:tagging-finished");

		this.#pub.send("core:inspection-started");
		await inspect({ context, inspectionHandlers, settings: this.#settings });
		this.#pub.send("core:inspection-finished", context);

		this.#pub.send("core:finished");

		await logger.uponDone();

		return context;
	}
}
