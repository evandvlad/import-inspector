import type { DefRef } from "~/lib/ref.ts";
import type { Import, ImportDefect as IImportDefect, Module } from "~/api.ts";

import { ImportDefect } from "../defect/index.ts";

import { Defects } from "./defects.ts";

export class ImportDefects extends Defects<IImportDefect> {
	#imp;
	#modRef;

	constructor({ imp, modRef }: { imp: Import; modRef: DefRef<Module> }) {
		super();

		this.#imp = imp;
		this.#modRef = modRef;
	}

	protected override createDefect(rule: string, description?: string) {
		return new ImportDefect({ rule, description, imp: this.#imp, mod: this.#modRef.value });
	}
}
