import type { Import_v2, ImportDefect_v2, ImportDefects_v2, Module_v2 } from "~/api.ts";
import { Dict } from "~/lib/dict.ts";

import { ImportDefect } from "./import-defect.ts";

export class ImportDefects extends Dict<ImportDefect_v2> implements ImportDefects_v2 {
	#imp;
	#mod;

	constructor({ imp, mod }: { imp: Import_v2; mod: Module_v2 }) {
		super();

		this.#imp = imp;
		this.#mod = mod;
	}

	get rules() {
		return this.toKeys();
	}

	add(rule: string, description?: string) {
		const defect = new ImportDefect({ rule, description, imp: this.#imp, mod: this.#mod });
		this.set(rule, defect);
		return this;
	}

	removeById(id: string) {
		const defect = this.find((defect) => defect.id === id);

		if (defect) {
			this.remove(defect.rule);
		}

		return this;
	}

	removeAll() {
		this.clear();
		return this;
	}
}
