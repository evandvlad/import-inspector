import type { Defects, Import, ImportDefect as IImportDefect, Module } from "~/api.ts";

import { Defect } from "./defect.ts";

export class ImportDefect extends Defect implements IImportDefect {
	imp;
	mod;
	defects;

	constructor({ rule, imp, mod, defects, description = "" }: {
		rule: string;
		imp: Import;
		mod: Module;
		defects: Defects<IImportDefect>;
		description?: string;
	}) {
		super({ rule, description });

		this.imp = imp;
		this.mod = mod;
		this.defects = defects;
	}
}
