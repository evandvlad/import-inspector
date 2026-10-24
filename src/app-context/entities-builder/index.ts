import { Dict } from "~/lib/dict.ts";
import type { Dict as IDict, Imp as IImp, Imps as IImps, Mod as IMod, Pack as IPack } from "~/api.d.ts";
import type { Settings } from "~/settings.ts";
import type { FileParsingResult } from "~/values.ts";

import { Imps } from "../imps.ts";
import { Imp } from "../imp.ts";
import { Mod } from "../mod.ts";
import { Pack } from "../pack.ts";

import { PackEntryPointDetector } from "./pack-entry-point-detector.ts";
import { PathRecProvider } from "./path-rec-provider/index.ts";
import { PackFinder } from "./pack-finder.ts";
import { ImpResolver } from "./imp-resolver.ts";

class EntitiesBuilder {
	#modDict;
	#impDict;
	#packDict;

	#settings;
	#parsingResult;
	#packFinder;
	#pathRecProvider;
	#packEntryPointDetector;

	constructor({ settings, parsingResult }: { settings: Settings; parsingResult: IDict<FileParsingResult> }) {
		this.#settings = settings;
		this.#parsingResult = parsingResult;
		this.#pathRecProvider = new PathRecProvider({ filePaths: parsingResult.toKeys() });
		this.#packEntryPointDetector = new PackEntryPointDetector({ pathRecProvider: this.#pathRecProvider });

		this.#packFinder = new PackFinder({
			pathRecProvider: this.#pathRecProvider,
			packEntryPointDetector: this.#packEntryPointDetector,
		});

		this.#impDict = Dict.empty<IImp>();
		this.#modDict = Dict.empty<IMod>();
		this.#packDict = Dict.empty<IPack>();
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
		const impResolver = new ImpResolver({ settings: this.#settings, pathRecProvider: this.#pathRecProvider });

		const linkPathsDict = Dict.empty<string[]>();
		const impsDict = Dict.empty<IImps>();

		this.#parsingResult.forEach(({ path, impRecs }) => {
			const impDict = Dict.empty<IImp>();

			impRecs.forEach((impRec) => {
				const resolution = impResolver.resolve({ path, impRec });
				const imp = new Imp({ modPath: path, impRec, resolution, modDict: this.#modDict });

				if (resolution?.path) {
					linkPathsDict.getOrInsert(resolution.path, []).push(path);
				}

				impDict.set(imp.id, imp);
				this.#impDict.set(imp.id, imp);
			});

			impsDict.set(path, new Imps({ dict: impDict }));
		});

		return { linkPathsDict, impsDict };
	}

	#prepareMods({ impsDict, linkPathsDict }: { impsDict: Dict<IImps>; linkPathsDict: Dict<string[]> }) {
		const packsDict = Dict.empty<Dict<IMod>>();

		this.#parsingResult.forEach(({ path, file }) => {
			const { baseName, shortPath } = this.#pathRecProvider.getFilePathRec(path);
			const packPath = this.#packFinder.findCurrent(path);
			const isPackEntry = packPath ? this.#packEntryPointDetector.selectFromChildren(packPath) === path : false;

			const mod = new Mod({
				path,
				file,
				packPath,
				shortPath,
				isPackEntry,
				name: baseName,
				modDict: this.#modDict,
				imps: impsDict.get(path),
				packDict: this.#packDict,
				linkPaths: linkPathsDict.getOrDefault(path, []),
			});

			this.#modDict.set(path, mod);

			if (packPath) {
				packsDict.getOrInsertComputed(packPath, () => Dict.empty()).set(path, mod);
			}
		});

		return { packsDict };
	}

	#preparePacks({ packsDict }: { packsDict: Dict<Dict<IMod>> }) {
		packsDict.forEach((modDict, path) => {
			const { baseName, shortPath, parentPath } = this.#pathRecProvider.getDirPathRec(path);

			const pack = new Pack({
				path,
				shortPath,
				modDict,
				name: baseName,
				parentPath: parentPath ? this.#packFinder.findCurrent(path) : null,
				childPaths: this.#packFinder.findChildren(path),
				packDict: this.#packDict,
			});

			this.#packDict.set(path, pack);
		});
	}
}

export function buildEntities(params: { settings: Settings; parsingResult: IDict<FileParsingResult> }) {
	return new EntitiesBuilder(params).build();
}
