import type { Nullable } from "~/lib/ts.ts";
import type { Dict as IDict, Imp as IImp, Mod, Span } from "~/api.d.ts";
import type { ImpRec, ImpResolutionData, ReExpRec } from "~/values.ts";

import { ImpexValues } from "./impex-values.ts";
import { ImpDefects } from "./imp-defects.ts";
import { cache } from "./tag-based-cache.ts";

export class Imp implements IImp {
	id;
	values;
	locator;
	location;
	isDynamic;
	isReExport;

	#modPath;
	#posSpan;
	#resolution;
	#modDict;

	static createFromImpRec({ modPath, impRec, resolution, modDict }: {
		modPath: string;
		impRec: ImpRec;
		resolution: Nullable<ImpResolutionData>;
		modDict: IDict<Mod>;
	}) {
		return new this({
			modPath,
			modDict,
			resolution,
			locator: impRec.locator,
			isDynamic: impRec.isDynamic,
			isReExport: false,
			values: impRec.values,
			posSpan: impRec.posSpan,
		});
	}

	static createFromReExpRec({ modPath, reExpRec, resolution, modDict }: {
		modPath: string;
		reExpRec: ReExpRec;
		resolution: Nullable<ImpResolutionData>;
		modDict: IDict<Mod>;
	}) {
		return new this({
			modPath,
			modDict,
			resolution,
			locator: reExpRec.locator,
			isDynamic: false,
			isReExport: true,
			values: reExpRec.lhValues,
			posSpan: reExpRec.posSpan,
		});
	}

	private constructor(
		{ modPath, locator, isDynamic, isReExport, values, posSpan, resolution, modDict }: {
			modPath: string;
			locator: string | null;
			isDynamic: boolean;
			isReExport: boolean;
			values: string[];
			posSpan: Span;
			resolution: Nullable<ImpResolutionData>;
			modDict: IDict<Mod>;
		},
	) {
		this.id = crypto.randomUUID();
		this.locator = locator;
		this.isDynamic = isDynamic;
		this.isReExport = isReExport;
		this.location = resolution?.path ?? this.locator;
		this.values = new ImpexValues({ values });

		this.#posSpan = posSpan;
		this.#modPath = modPath;
		this.#resolution = resolution;
		this.#modDict = modDict;
	}

	@cache()
	get defects() {
		return new ImpDefects({ imp: this as IImp, mod: this.sourceMod });
	}

	get sourceMod() {
		return this.#modDict.get(this.#modPath);
	}

	get importedMod() {
		return this.resolution?.mod ?? null;
	}

	@cache()
	get resolution() {
		if (!this.#resolution) {
			return null;
		}

		const { path, isExternal, isRelative } = this.#resolution;

		return {
			isExternal,
			isRelative,
			mod: path ? this.#modDict.get(path) : null,
		};
	}

	@cache()
	get fileLineRange() {
		const { file } = this.sourceMod;
		return file.getLineRange(this.#posSpan);
	}

	@cache()
	get fileEntries() {
		const { file } = this.sourceMod;
		return file.getEntriesBySpan(this.#posSpan);
	}
}
