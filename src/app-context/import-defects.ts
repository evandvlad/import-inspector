import { assertNever } from "~/lib/ts.ts";
import type { ImportDefects as IImportDefects, Json, ViewDataMode } from "~/api.ts";

import type { ImportDefect } from "./import-defect.ts";
import type { Imports } from "./imports.ts";

export class ImportDefects implements IImportDefects {
	#imports;

	constructor({ imports }: { imports: Imports }) {
		this.#imports = imports;
	}

	getAll() {
		return this.#imports.getAll().flatMap(({ defects }) => defects);
	}

	getAllAsRuleMap() {
		return this.#imports.getAll().reduce((acc, { defects }) => {
			defects.forEach((defect) => {
				acc.getOrInsert(defect.rule, []).push(defect);
			});

			return acc;
		}, new Map<string, ImportDefect[]>());
	}

	getAllAsModulePathMap() {
		return this.#imports.getAll().reduce((acc, { sourcePath, defects }) => {
			defects.forEach((defect) => {
				acc.getOrInsert(sourcePath, []).push(defect);
			});

			return acc;
		}, new Map<string, ImportDefect[]>());
	}

	getAllRules() {
		const all = this.#imports.getAll().flatMap(({ defects }) => defects.map(({ rule }) => rule));
		return Array.from(new Set(all));
	}

	getByRule(rule: string) {
		return Iterator.from(this.#imports.getAll())
			.map((imp) => imp.findDefect(rule))
			.filter((defect): defect is ImportDefect => Boolean(defect))
			.toArray();
	}

	getModulePathsByRule(rule: string) {
		return Iterator.from(this.#imports.getAll())
			.filter((imp) => imp.hasDefect(rule))
			.map(({ sourcePath }) => sourcePath)
			.toArray();
	}

	remove({ importId, rule }: { importId: string; rule: string }) {
		const imp = this.#imports.get(importId);
		imp.removeDefect(rule);
	}

	removeByRule(rule: string) {
		this.getByRule(rule).forEach(({ importId }) => {
			this.remove({ importId, rule });
		});
	}

	removeAll() {
		this.getAll().forEach(({ importId, rule }) => {
			this.remove({ importId, rule });
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
