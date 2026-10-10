import type { ImportDefects as IImportDefects, Imports } from "~/api.ts";

import { ImportDefectRulesSample } from "./samples/import-defect-rules.ts";
import { ImportDefectModPathsSample } from "./samples/import-defect-mod-paths.ts";

export class ImportDefects implements IImportDefects {
	#imports;

	constructor({ imports }: { imports: Imports }) {
		this.#imports = imports;
	}

	getAll() {
		return this.#imports.all.toArray().flatMap(({ defects }) => defects.toArray());
	}

	getAllRules() {
		const all = this.#imports.all.toArray().flatMap(({ defects }) => defects.toArray().map(({ rule }) => rule));
		return Array.from(new Set(all));
	}

	sampleRules() {
		return new ImportDefectRulesSample({ imports: this.#imports });
	}

	sampleModPaths() {
		return new ImportDefectModPathsSample({ imports: this.#imports });
	}

	remove(importId: string, rule: string) {
		const imp = this.#imports.all.get(importId);
		imp.defects.remove(rule);
	}

	removeByRule(rule: string) {
		this.#imports.all.forEach((imp) => {
			const defect = imp.defects.getOrDefault(rule, null);

			if (defect) {
				this.remove(imp.id, rule);
			}
		});
	}

	removeAll() {
		this.getAll().forEach(({ importId, rule }) => {
			this.remove(importId, rule);
		});
	}
}
