import type { ImportDefects as IImportDefects } from "~/api.ts";

import type { Imports } from "./imports.ts";
import { ImportDefectRulesSample } from "./samples/import-defect-rules.ts";
import { ImportDefectModPathsSample } from "./samples/import-defect-mod-paths.ts";

export class ImportDefects implements IImportDefects {
	#imports;

	constructor({ imports }: { imports: Imports }) {
		this.#imports = imports;
	}

	getAll() {
		return this.#imports.all.toList().flatMap(({ defects }) => defects);
	}

	getAllRules() {
		const all = this.#imports.all.toList().flatMap(({ defects }) => defects.map(({ rule }) => rule));
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
		imp.removeDefect(rule);
	}

	removeByRule(rule: string) {
		this.#imports.all.forEach((imp) => {
			const defect = imp.findDefect(rule);

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
