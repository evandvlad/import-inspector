import type { Import_v2, ImportDefect_v2, Module_v2 } from "~/api.ts";

import { Defect } from "./defect.ts";

export class ImportDefect extends Defect implements ImportDefect_v2 {
	imp;
	mod;

	constructor({ rule, imp, mod, description = "" }: {
		rule: string;
		imp: Import_v2;
		mod: Module_v2;
		description?: string;
	}) {
		super({ rule, description });

		this.imp = imp;
		this.mod = mod;
	}
}
