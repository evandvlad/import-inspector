import type { AppContextDefects, Dict, Import, ImportDefect, Module, ModuleDefect } from "~/api.ts";

export abstract class ContextDefects<T extends ImportDefect | ModuleDefect> {
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

export class ContextModuleDefects extends ContextDefects<ModuleDefect> implements AppContextDefects<ModuleDefect> {
	#modDict;

	constructor({ modDict }: { modDict: Dict<Module> }) {
		super();
		this.#modDict = modDict;
	}

	protected override createDictById() {
		return this.#modDict.fold<ModuleDefect>((acc, mod) => acc.merge(mod.defects.byRule.mapK(({ id }) => id)));
	}

	protected override createDictByPath() {
		return this.#modDict.fold<ModuleDefect[]>((acc, mod) => {
			if (mod.defects.total > 0) {
				acc.set(mod.path, mod.defects.byRule.toArray());
			}

			return acc;
		});
	}

	protected override createDictByRule() {
		return this.#modDict.fold<ModuleDefect[]>((acc, mod) => {
			mod.defects.byRule.forEach((defect) => {
				acc.getOrInsert(defect.rule, []).push(defect);
			});

			return acc;
		});
	}

	protected override removeDefect(defect: ModuleDefect) {
		defect.mod.defects.remove(defect.rule);
	}
}

export class ContextImportDefects extends ContextDefects<ImportDefect> implements AppContextDefects<ImportDefect> {
	#impDict;

	constructor({ impDict }: { impDict: Dict<Import> }) {
		super();
		this.#impDict = impDict;
	}

	protected override createDictById() {
		return this.#impDict.fold<ImportDefect>((acc, imp) => acc.merge(imp.defects.byRule.mapK(({ id }) => id)));
	}

	protected override createDictByPath() {
		return this.#impDict.fold<ImportDefect[]>((acc, imp) => {
			if (imp.defects.total > 0) {
				acc.addOrReduce(imp.sourceMod.path, imp.defects.byRule.toArray(), (acc, value) => acc.concat(value));
			}

			return acc;
		});
	}

	protected override createDictByRule() {
		return this.#impDict.fold<ImportDefect[]>((acc, imp) => {
			imp.defects.byRule.forEach((defect) => {
				acc.getOrInsert(defect.rule, []).push(defect);
			});

			return acc;
		});
	}

	protected override removeDefect(defect: ImportDefect) {
		defect.imp.defects.remove(defect.rule);
	}
}
