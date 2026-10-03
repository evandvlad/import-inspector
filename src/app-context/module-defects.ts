import { assertNever } from "~/lib/ts.ts";
import type { Json, ModuleDefects as IModuleDefects, ViewDataMode } from "~/api.ts";

import type { ModuleDefect } from "./module-defect.ts";
import type { Modules } from "./modules.ts";

export class ModuleDefects implements IModuleDefects {
	#modules;

	constructor({ modules }: { modules: Modules }) {
		this.#modules = modules;
	}

	getAll() {
		return this.#modules.getAll().flatMap(({ defects }) => defects);
	}

	getAllAsPathMap() {
		return new Map(
			Iterator.from(this.#modules.getAll())
				.filter(({ defects }) => defects.length > 0)
				.map(({ path, defects }) => [path, defects]),
		);
	}

	getAllAsRuleMap() {
		return this.#modules.getAll().reduce((acc, { defects }) => {
			defects.forEach((defect) => {
				acc.getOrInsert(defect.rule, []).push(defect);
			});

			return acc;
		}, new Map<string, ModuleDefect[]>());
	}

	getAllRules() {
		const all = this.#modules.getAll().flatMap(({ defects }) => defects.map(({ rule }) => rule));
		return Array.from(new Set(all));
	}

	getByRule(rule: string) {
		return Iterator.from(this.#modules.getAll())
			.map((mod) => mod.findDefect(rule))
			.filter((defect): defect is ModuleDefect => Boolean(defect))
			.toArray();
	}

	remove({ path, rule }: { path: string; rule: string }) {
		const mod = this.#modules.get(path);
		mod.removeDefect(rule);
	}

	removeByRule(rule: string) {
		this.getByRule(rule).forEach(({ sourcePath }) => {
			this.remove({ path: sourcePath, rule });
		});
	}

	removeAll() {
		this.getAll().forEach(({ sourcePath, rule }) => {
			this.remove({ path: sourcePath, rule });
		});
	}

	toViewData(mode: ViewDataMode = "brief"): Json {
		switch (mode) {
			case "minimal":
				return this.getAll().length;

			case "brief":
				return this.getAll().map((defect) => defect.toViewData("brief"));

			case "verbose":
				return this.getAll().map((defect) => defect.toViewData("verbose"));

			default:
				assertNever(mode);
		}
	}
}
