import type { DefRef } from "~/lib/ref.ts";
import type { Import_v2, ImportDefect_v2, Module_v2 } from "~/api.ts";

import { ImportDefect } from "../defect/index.ts";

import { Defects } from "./defects.ts";

export class ImportDefects extends Defects<ImportDefect_v2> {
	#imp;
	#modRef;

	constructor({ imp, modRef }: { imp: Import_v2; modRef: DefRef<Module_v2> }) {
		super();

		this.#imp = imp;
		this.#modRef = modRef;
	}

	protected override createDefect(rule: string, description?: string) {
		return new ImportDefect({ rule, description, imp: this.#imp, mod: this.#modRef.value });
	}
}
