import { Dict } from "~/lib/dict.ts";
import type { Settings } from "~/settings.ts";
import type { FileParsingResult } from "~/values.ts";

import type { PathRecProvider } from "../path-rec-provider/index.ts";
import type { PackageFinder } from "../package-finder/index.ts";
import type { PackageEntryPointDetector } from "../package-entry-point-detector/index.ts";
import { Module } from "../module.ts";
import { Import } from "../import.ts";

import { ImportResolver } from "./import-resolver.ts";
import { InterconnectionBuilder } from "./interconnection-builder.ts";

export function buildModules(
	{ settings, parsingResult, pathRecProvider, packageFinder, packageEntryPointDetector }: {
		settings: Settings;
		packageFinder: PackageFinder;
		parsingResult: Dict<FileParsingResult>;
		pathRecProvider: PathRecProvider;
		packageEntryPointDetector: PackageEntryPointDetector;
	},
) {
	const interconnectionBuilder = new InterconnectionBuilder();
	const importResolver = new ImportResolver({ settings, pathRecProvider });

	parsingResult.forEach(({ path, importRecs }) => {
		const imports = Dict.fromEntries(importRecs.map((importRec) => {
			const resolution = importResolver.resolve({ path, importRec });
			const imp = new Import({ path, importRec, resolution });
			return [imp.id, imp];
		}));

		interconnectionBuilder.connect({ path, imports });
	});

	const interconnectionReader = interconnectionBuilder.build();

	return parsingResult.map(({ path, file }) => {
		const pack = packageFinder.findCurrent(path);
		const isPackEntry = pack ? packageEntryPointDetector.selectFromChildren(pack) === path : false;

		return new Module({
			file,
			pack,
			isPackEntry,
			filePathRec: pathRecProvider.getFilePathRec(path),
			imports: interconnectionReader.getImports(path),
			links: interconnectionReader.getLinks(path),
		});
	});
}
