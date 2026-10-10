import type { ImportDefect, ImportDefects as IImportDefects, Imports } from "~/api.ts";

export class ImportDefects implements IImportDefects {
	#imports;

	constructor({ imports }: { imports: Imports }) {
		this.#imports = imports;
	}

	get total() {
		return this.#imports.all.reduce((acc, { defects }) => acc + defects.size, 0);
	}

	get byRule() {
		return this.#imports.all.fold<ImportDefect[]>((acc, imp) => {
			imp.defects.forEach((defect) => {
				acc.getOrInsert(defect.rule, []).push(defect);
			});

			return acc;
		});
	}

	get bySource() {
		return this.#imports.all.fold<ImportDefect[]>((acc, imp) => {
			imp.defects.forEach((defect) => {
				acc.getOrInsert(defect.source, []).push(defect);
			});

			return acc;
		});
	}

	remove(importId: string, rule: string) {
		const imp = this.#imports.all.get(importId);
		imp.defects.remove(rule);
	}

	removeByRule(rule: string) {
		this.#imports.all.forEach((imp) => {
			imp.defects.remove(rule);
		});
	}

	removeAll() {
		this.#imports.all.forEach((imp) => {
			imp.defects.clear();
		});
	}
}
