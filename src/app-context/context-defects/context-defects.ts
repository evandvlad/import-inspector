import type { Dict, ImportDefect, ModuleDefect } from "~/api.ts";

export abstract class ContextDefects<T extends ImportDefect | ModuleDefect> {
	get size() {
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
	protected abstract createDictByPath(): Dict<Dict<T>>;
	protected abstract createDictByRule(): Dict<Dict<T>>;
	protected abstract removeDefect(defect: T): void;
}
