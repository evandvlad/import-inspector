import type { ImportDefect_v1, ImportDefects_v1, Imports_v1 } from "~/api.ts";

export class ImportDefects implements ImportDefects_v1 {
	#imports;

	constructor({ imports }: { imports: Imports_v1 }) {
		this.#imports = imports;
	}

	get total() {
		return this.#imports.all.reduce((acc, { defects }) => acc + defects.size, 0);
	}

	get byRule() {
		return this.#imports.all.fold<ImportDefect_v1[]>((acc, imp) => {
			imp.defects.forEach((defect) => {
				acc.getOrInsert(defect.rule, []).push(defect);
			});

			return acc;
		});
	}

	get bySource() {
		return this.#imports.all.fold<ImportDefect_v1[]>((acc, imp) => {
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
