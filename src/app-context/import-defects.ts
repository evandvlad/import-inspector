import { assertNever } from "~/lib/ts.ts";
import type { ImportDefects as IImportDefects, Json, ViewDataMode } from "~/api.ts";

import type { ImportDefect } from "./import-defect.ts";
import type { Imports } from "./imports.ts";
import { ImportDefectRulesSample } from "./samples/import-defect-rules.ts";
import { ImportDefectModPathsSample } from "./samples/import-defect-mod-paths.ts";

export class ImportDefects implements IImportDefects {
	#imports;

	constructor({ imports }: { imports: Imports }) {
		this.#imports = imports;
	}

	getAll() {
		return this.#imports.getAll().flatMap(({ defects }) => defects);
	}

	getAllRules() {
		const all = this.#imports.getAll().flatMap(({ defects }) => defects.map(({ rule }) => rule));
		return Array.from(new Set(all));
	}

	sampleRules() {
		return new ImportDefectRulesSample({ imports: this.#imports });
	}

	sampleModPaths() {
		return new ImportDefectModPathsSample({ imports: this.#imports });
	}

	remove(importId: string, rule: string) {
		const imp = this.#imports.get(importId);
		imp.removeDefect(rule);
	}

	removeByRule(rule: string) {
		Iterator.from(this.#imports.getAll())
			.map((imp) => imp.findDefect(rule))
			.filter((defect): defect is ImportDefect => Boolean(defect))
			.forEach(({ importId }) => {
				this.remove(importId, rule);
			});
	}

	removeAll() {
		this.getAll().forEach(({ importId, rule }) => {
			this.remove(importId, rule);
		});
	}

	toViewData(mode: ViewDataMode = "brief"): Json {
		switch (mode) {
			case "minimal":
				return this.getAll().length;

			case "brief":
				return this.getAll().map((defect) => defect.toViewData("brief"));

			case "verbose":
				return this.getAll().map((defect) => defect.toViewData("verbose"));

			default:
				assertNever(mode);
		}
	}
}
