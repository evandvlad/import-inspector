import { Dict } from "~/lib/dict.ts";
import type { Nullable } from "~/lib/ts.ts";
import type {
	Dict as IDict,
	Exps as IExps,
	Imp as IImp,
	Imps as IImps,
	LocalExp as ILocalExp,
	Mod as IMod,
	Pack as IPack,
	ReExp as IReExp,
} from "~/api.d.ts";
import type { Settings } from "~/settings.ts";
import type { FileParsingResult, Impex, ImpRec, ImpResolutionData, ReExpRec } from "~/values.ts";
import { pub } from "~/program-events.ts";

import { LocalExp } from "../local-exp.ts";
import { ReExp } from "../re-exp.ts";
import { Exps } from "../exps.ts";
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

		const filePaths = parsingResult.toKeys();

		pub.send("app-context.path-rec-provider:started", filePaths);
		this.#pathRecProvider = new PathRecProvider({ filePaths });
		pub.send("app-context.path-rec-provider:finished");

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
		pub.send("app-context.impex-build:started");
		const { linkPathsDict, impsDict, expsDict } = this.#prepareImpex();
		pub.send("app-context.impex-build:finished");

		pub.send("app-context.mods-build:started");
		const { packsDict } = this.#prepareMods({ linkPathsDict, impsDict, expsDict });
		pub.send("app-context.mods-build:finished");

		pub.send("app-context.packs-build:started");
		this.#preparePacks({ packsDict });
		pub.send("app-context.packs-build:finished");

		return {
			basePath: this.#pathRecProvider.basePath,
			impDict: this.#impDict,
			modDict: this.#modDict,
			packDict: this.#packDict,
		};
	}

	#createImp(
		{ modPath, rec, resolution }: {
			modPath: string;
			rec: ImpRec | ReExpRec;
			resolution: Nullable<ImpResolutionData>;
		},
	) {
		return rec.kind === "imp"
			? Imp.createFromImpRec({ modPath, impRec: rec, resolution, modDict: this.#modDict })
			: Imp.createFromReExpRec({ modPath, reExpRec: rec, resolution, modDict: this.#modDict });
	}

	#createLocalExpDict({ impex, modPath }: { impex: Impex; modPath: string }) {
		return Dict.fromEntries<ILocalExp>(impex.exps.map((expRec) => {
			const localExp = new LocalExp({ modPath, expRec, modDict: this.#modDict });
			return [localExp.id, localExp];
		}));
	}

	#createReExpDict(
		{ impex, modPath, reExpResolutionDict }: {
			impex: Impex;
			modPath: string;
			reExpResolutionDict: Dict<Nullable<ImpResolutionData>>;
		},
	) {
		return Dict.fromEntries<IReExp>(impex.reExps.map((reExpRec) => {
			const reExp = new ReExp({
				modPath,
				reExpRec,
				resolution: reExpResolutionDict.get(reExpRec.locator),
				modDict: this.#modDict,
			});

			return [reExp.id, reExp];
		}));
	}

	#prepareImpex() {
		const impResolver = new ImpResolver({ settings: this.#settings, pathRecProvider: this.#pathRecProvider });

		const linkPathsDict = Dict.empty<string[]>();
		const impsDict = Dict.empty<IImps>();
		const expsDict = Dict.empty<IExps>();

		this.#parsingResult.forEach(({ path, impex }) => {
			const impDict = Dict.empty<IImp>();
			const reExpResolutionDict = Dict.empty<Nullable<ImpResolutionData>>();

			[...impex.imps, ...impex.reExps].forEach((rec) => {
				const resolution = impResolver.resolve({ path, locator: rec.locator });
				const imp = this.#createImp({ modPath: path, resolution, rec });

				if (resolution?.path) {
					linkPathsDict.getOrInsert(resolution.path, []).push(path);
				}

				if (rec.kind === "re-exp") {
					reExpResolutionDict.set(rec.locator, resolution);
				}

				impDict.set(imp.id, imp);
				this.#impDict.set(imp.id, imp);
			});

			impsDict.set(path, new Imps({ dict: impDict }));

			expsDict.set(
				path,
				new Exps({
					modPath: path,
					localExpDict: this.#createLocalExpDict({ modPath: path, impex }),
					reExpDict: this.#createReExpDict({ modPath: path, impex, reExpResolutionDict }),
					modDict: this.#modDict,
				}),
			);
		});

		return { linkPathsDict, impsDict, expsDict };
	}

	#prepareMods(
		{ impsDict, expsDict, linkPathsDict }: {
			impsDict: Dict<IImps>;
			expsDict: Dict<IExps>;
			linkPathsDict: Dict<string[]>;
		},
	) {
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
				exps: expsDict.get(path),
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
