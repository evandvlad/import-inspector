import { Dict } from "~/lib/dict.ts";
import type {
	Dict as IDict,
	Import as IImport,
	Imports as IImports,
	Module as IModule,
	Package as IPackage,
} from "~/api.ts";
import type { Settings } from "~/settings.ts";
import type { FileParsingResult } from "~/values.ts";

import { Imports } from "../imports.ts";
import { Import } from "../import.ts";
import { Module } from "../module.ts";
import { Package } from "../package.ts";

import { PackageEntryPointDetector } from "./package-entry-point-detector.ts";
import { PathRecProvider } from "./path-rec-provider/index.ts";
import { PackageFinder } from "./package-finder.ts";
import { ImportResolver } from "./import-resolver.ts";

class EntitiesBuilder {
	#modDict;
	#impDict;
	#packDict;

	#settings;
	#parsingResult;
	#packageFinder;
	#pathRecProvider;
	#packageEntryPointDetector;

	constructor({ settings, parsingResult }: { settings: Settings; parsingResult: IDict<FileParsingResult> }) {
		this.#settings = settings;
		this.#parsingResult = parsingResult;
		this.#pathRecProvider = new PathRecProvider({ filePaths: parsingResult.toKeys() });
		this.#packageEntryPointDetector = new PackageEntryPointDetector({ pathRecProvider: this.#pathRecProvider });

		this.#packageFinder = new PackageFinder({
			pathRecProvider: this.#pathRecProvider,
			packageEntryPointDetector: this.#packageEntryPointDetector,
		});

		this.#impDict = Dict.empty<IImport>();
		this.#modDict = Dict.empty<IModule>();
		this.#packDict = Dict.empty<IPackage>();
	}

	build() {
		const { linkPathsDict, impsDict } = this.#prepareImps();
		const { packsDict } = this.#prepareMods({ linkPathsDict, impsDict });
		this.#preparePacks({ packsDict });

		return {
			basePath: this.#pathRecProvider.basePath,
			impDict: this.#impDict,
			modDict: this.#modDict,
			packDict: this.#packDict,
		};
	}

	#prepareImps() {
		const importResolver = new ImportResolver({ settings: this.#settings, pathRecProvider: this.#pathRecProvider });

		const linkPathsDict = Dict.empty<string[]>();
		const impsDict = Dict.empty<IImports>();

		this.#parsingResult.forEach(({ path, importRecs }) => {
			const impDict = Dict.empty<IImport>();

			importRecs.forEach((importRec) => {
				const resolution = importResolver.resolve({ path, importRec });
				const imp = new Import({ modPath: path, importRec, resolution, modDict: this.#modDict });

				if (resolution?.path) {
					linkPathsDict.getOrInsert(resolution.path, []).push(path);
				}

				impDict.set(imp.id, imp);
				this.#impDict.set(imp.id, imp);
			});

			impsDict.set(path, new Imports({ dict: impDict }));
		});

		return { linkPathsDict, impsDict };
	}

	#prepareMods({ impsDict, linkPathsDict }: { impsDict: Dict<IImports>; linkPathsDict: Dict<string[]> }) {
		const packsDict = Dict.empty<Dict<IModule>>();

		this.#parsingResult.forEach(({ path, file }) => {
			const { baseName, shortPath } = this.#pathRecProvider.getFilePathRec(path);
			const packPath = this.#packageFinder.findCurrent(path);

			const isPackEntry = packPath
				? this.#packageEntryPointDetector.selectFromChildren(packPath) === path
				: false;

			const mod = new Module({
				path,
				file,
				packPath,
				shortPath,
				isPackEntry,
				name: baseName,
				imps: impsDict.get(path),
				linkPaths: linkPathsDict.getOrDefault(path, []),
				modDict: this.#modDict,
				packDict: this.#packDict,
			});

			this.#modDict.set(path, mod);

			if (packPath) {
				packsDict.getOrInsert(packPath, Dict.empty()).set(path, mod);
			}
		});

		return { packsDict };
	}

	#preparePacks({ packsDict }: { packsDict: Dict<Dict<IModule>> }) {
		packsDict.forEach((modDict, path) => {
			const { name, shortPath, parentPath } = this.#pathRecProvider.getDirPathRec(path);

			const pack = new Package({
				name,
				path,
				shortPath,
				modDict,
				parentPath: parentPath ? this.#packageFinder.findCurrent(path) : null,
				childPaths: this.#packageFinder.findChildren(path),
				packDict: this.#packDict,
			});

			this.#packDict.set(path, pack);
		});
	}
}

export function buildEntities(params: { settings: Settings; parsingResult: IDict<FileParsingResult> }) {
	return new EntitiesBuilder(params).build();
}
