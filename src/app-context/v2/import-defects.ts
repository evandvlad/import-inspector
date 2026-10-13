import { Dict } from "~/lib/dict.ts";
import type { DefRef } from "~/lib/ref.ts";
import type { Import_v2, ImportDefect_v2, ImportDefects_v2, Module_v2 } from "~/api.ts";

import { ImportDefect } from "./import-defect.ts";

export class ImportDefects extends Dict<ImportDefect_v2> implements ImportDefects_v2 {
	#imp;
	#modRef;

	constructor({ imp, modRef }: { imp: Import_v2; modRef: DefRef<Module_v2> }) {
		super();

		this.#imp = imp;
		this.#modRef = modRef;
	}

	get rules() {
		return this.toKeys();
	}

	add(rule: string, description?: string) {
		const defect = new ImportDefect({ rule, description, imp: this.#imp, mod: this.#modRef.value });
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
