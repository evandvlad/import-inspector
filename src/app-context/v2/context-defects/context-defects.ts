import type { AppContextDefects_v2, Dict, Import_v2, ImportDefect_v2, Module_v2, ModuleDefect_v2 } from "~/api.ts";

export abstract class ContextDefects<T extends ImportDefect_v2 | ModuleDefect_v2> {
	get total() {
		return this.byId.size;
	}

	get ids() {
		return this.byId.toKeys();
	}

	get paths() {
		return this.byPath.toKeys();
	}

	get rules() {
		return this.byRule.toKeys();
	}

	get byId() {
		return this.createDictById();
	}

	get byRule() {
		return this.createDictByRule();
	}

	get byPath() {
		return this.createDictByPath();
	}

	removeById(id: string) {
		const defect = this.byId.getOrDefault(id, null);

		if (defect) {
			this.removeDefect(defect);
		}

		return this;
	}

	removeByRule(rule: string) {
		const defects = this.byRule.getOrDefault<T[]>(rule, []);

		defects.forEach((defect) => {
			this.removeDefect(defect);
		});

		return this;
	}

	removeAll() {
		this.byId.forEach((defect) => {
			this.removeDefect(defect);
		});

		return this;
	}

	protected abstract createDictById(): Dict<T>;
	protected abstract createDictByPath(): Dict<T[]>;
	protected abstract createDictByRule(): Dict<T[]>;
	protected abstract removeDefect(defect: T): void;
}

export class ContextModuleDefects extends ContextDefects<ModuleDefect_v2>
	implements AppContextDefects_v2<ModuleDefect_v2> {
	#modDict;

	constructor({ modDict }: { modDict: Dict<Module_v2> }) {
		super();
		this.#modDict = modDict;
	}

	protected override createDictById() {
		return this.#modDict.fold<ModuleDefect_v2>((acc, mod) => acc.merge(mod.defects.byRule.mapK(({ id }) => id)));
	}

	protected override createDictByPath() {
		return this.#modDict.fold<ModuleDefect_v2[]>((acc, mod) => {
			if (mod.defects.total > 0) {
				acc.set(mod.path, mod.defects.byRule.toArray());
			}

			return acc;
		});
	}

	protected override createDictByRule() {
		return this.#modDict.fold<ModuleDefect_v2[]>((acc, mod) => {
			mod.defects.byRule.forEach((defect) => {
				acc.getOrInsert(defect.rule, []).push(defect);
			});

			return acc;
		});
	}

	protected override removeDefect(defect: ModuleDefect_v2) {
		defect.mod.defects.remove(defect.rule);
	}
}

export class ContextImportDefects extends ContextDefects<ImportDefect_v2>
	implements AppContextDefects_v2<ImportDefect_v2> {
	#impDict;

	constructor({ impDict }: { impDict: Dict<Import_v2> }) {
		super();
		this.#impDict = impDict;
	}

	protected override createDictById() {
		return this.#impDict.fold<ImportDefect_v2>((acc, imp) => acc.merge(imp.defects.byRule.mapK(({ id }) => id)));
	}

	protected override createDictByPath() {
		return this.#impDict.fold<ImportDefect_v2[]>((acc, imp) => {
			if (imp.defects.total > 0) {
				acc.addOrReduce(imp.sourceMod.path, imp.defects.byRule.toArray(), (acc, value) => acc.concat(value));
			}

			return acc;
		});
	}

	protected override createDictByRule() {
		return this.#impDict.fold<ImportDefect_v2[]>((acc, imp) => {
			imp.defects.byRule.forEach((defect) => {
				acc.getOrInsert(defect.rule, []).push(defect);
			});

			return acc;
		});
	}

	protected override removeDefect(defect: ImportDefect_v2) {
		defect.imp.defects.remove(defect.rule);
	}
}
