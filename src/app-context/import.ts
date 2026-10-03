import { assertNever } from "~/lib/ts.ts";
import { assert } from "~/lib/err.ts";
import type { Import as IImport, Json, ViewDataMode } from "~/api.ts";
import type { ImportRec, ImportResolution } from "~/values.ts";

import { ImportDefect } from "./import-defect.ts";

export class Import implements IImport {
	id;
	locator;
	posSpan;
	isDynamic;
	sourcePath;
	resolution;
	defects: ImportDefect[];

	resolutionPath;
	location;

	constructor(
		{ path, importRec, resolution }: { path: string; importRec: ImportRec; resolution: ImportResolution | null },
	) {
		this.id = crypto.randomUUID() as string;
		this.sourcePath = path;
		this.resolution = resolution;
		this.locator = importRec.locator;
		this.posSpan = importRec.posSpan;
		this.isDynamic = importRec.isDynamic;
		this.defects = [];

		this.resolutionPath = resolution?.path ?? null;
		this.location = this.resolutionPath ?? this.locator;
	}

	hasDefect(rule: string) {
		return this.defects.some((defect) => defect.rule === rule);
	}

	findDefect(rule: string) {
		return this.defects.find((defect) => defect.rule === rule) ?? null;
	}

	getDefect(rule: string) {
		const defect = this.findDefect(rule);
		assert(defect, `Can't find import defect for rule '${rule}'.`);
		return defect;
	}

	addDefect({ rule, description }: { rule: string; description?: string }) {
		if (this.hasDefect(rule)) {
			return;
		}

		this.defects.push(
			new ImportDefect({
				rule,
				description,
				importId: this.id,
				posSpan: this.posSpan,
				locator: this.locator,
				sourcePath: this.sourcePath,
				importedPath: this.resolutionPath,
			}),
		);
	}

	removeDefect(rule: string) {
		this.defects = this.defects.filter((defect) => defect.rule !== rule);
	}

	toViewData(mode: ViewDataMode = "brief"): Json {
		switch (mode) {
			case "minimal":
				return this.location;

			case "brief":
				return this.#toBriefViewData();

			case "verbose":
				return {
					...this.#toBriefViewData(),
					defects: this.defects.map((defect) => defect.toViewData("verbose")),
				};

			default:
				assertNever(mode);
		}
	}

	#toBriefViewData() {
		return {
			location: this.location,
			sourcePath: this.sourcePath,
			defects: this.defects.length,
		};
	}
}
