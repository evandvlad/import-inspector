import type { Settings } from "~/settings.ts";

import type { FileParsingResult } from "../values.ts";
import type { PathRecProvider } from "../path-rec-provider/index.ts";
import type { PackageFinder } from "../package-finder/index.ts";
import type { PackageEntryPointDetector } from "../package-entry-point-detector/index.ts";
import type { FrameRegistry } from "../frame-registry.ts";
import { Module } from "../module.ts";
import { Import } from "../import.ts";

import { ImportResolver } from "./import-resolver.ts";
import { InterconnectionBuilder } from "./interconnection-builder.ts";

export function buildModules(
	{ settings, parsingResult, pathRecProvider, packageFinder, frameRegistry, packageEntryPointDetector }: {
		settings: Settings;
		frameRegistry: FrameRegistry;
		packageFinder: PackageFinder;
		parsingResult: FileParsingResult[];
		pathRecProvider: PathRecProvider;
		packageEntryPointDetector: PackageEntryPointDetector;
	},
) {
	const interconnectionBuilder = new InterconnectionBuilder();
	const importResolver = new ImportResolver({ settings, pathRecProvider });

	parsingResult.forEach(({ filePathRec, importRecs }) => {
		const imports = importRecs.map((importRec) =>
			new Import({ importRec, resolution: importResolver.resolve(importRec) })
		);

		interconnectionBuilder.connect({ path: filePathRec.path, imports });
	});

	const interconnectionReader = interconnectionBuilder.build();

	return parsingResult.map(({ filePathRec }) => {
		const { path } = filePathRec;
		const packagePath = packageFinder.findCurrent(path);

		const isPackageEntryPoint = packagePath
			? packageEntryPointDetector.selectFromChildren(packagePath) === path
			: false;

		return new Module({
			filePathRec,
			packagePath,
			isPackageEntryPoint,
			imports: interconnectionReader.getImports(path),
			links: interconnectionReader.getLinks(path),
			frames: frameRegistry.getNamesByPath(path),
		});
	});
}
