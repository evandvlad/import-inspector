import type { Import, ImportDefect as IImportDefect, Module } from "~/api.ts";

import { Defect } from "./defect.ts";

export class ImportDefect extends Defect implements IImportDefect {
	imp;
	mod;

	constructor({ rule, imp, mod, description = "" }: {
		rule: string;
		imp: Import;
		mod: Module;
		description?: string;
	}) {
		super({ rule, description });

		this.imp = imp;
		this.mod = mod;
	}
}
