import type { Import, ImportDefect as IImportDefect, Module } from "~/api.ts";

import { clear } from "../tag-based-cache.ts";
import { ImportDefect } from "../defect/index.ts";

import { Defects } from "./defects.ts";

export class ImportDefects extends Defects<IImportDefect> {
	#imp;
	#mod;

	constructor({ imp, mod }: { imp: Import; mod: Module }) {
		super();

		this.#imp = imp;
		this.#mod = mod;
	}

	protected override createDefect(rule: string, description?: string) {
		return new ImportDefect({
			rule,
			description,
			imp: this.#imp,
			mod: this.#mod,
			defects: this,
		});
	}

	@clear("import-defects")
	override add(rule: string, description?: string) {
		super.add(rule, description);
		return this;
	}

	@clear("import-defects")
	override remove(rule: string) {
		super.remove(rule);
		return this;
	}

	@clear("import-defects")
	override removeAll() {
		super.removeAll();
		return this;
	}
}
