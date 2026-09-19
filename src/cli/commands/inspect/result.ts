import { type ImportDefect, type Lang, langs, type ModuleDefect } from "~/api.ts";
import type { Context } from "~/core/index.ts";

import type { DefectDetails } from "./values.ts";

export class Result {
	hasDefects;
	tagCounter;
	frameCounter;
	defectCounter;
	moduleCounter;
	packageCounter;
	importCounter;
	defectDetailsMap;

	#context;

	constructor({ context }: { context: Context }) {
		this.#context = context;

		const { counter, defectDetailsMap } = this.#getDefects();

		this.defectCounter = counter;
		this.defectDetailsMap = defectDetailsMap;
		this.tagCounter = this.#getTagCounter();
		this.frameCounter = this.#getFrameCounter();
		this.packageCounter = this.#getPackageCounter();
		this.moduleCounter = this.#getModuleCounter();
		this.importCounter = this.#getImportCounter();

		this.hasDefects = counter.total > 0;
	}

	#getDefects() {
		const { importDefects, moduleDefects } = this.#context;

		const allImportDefects = importDefects.getAll();
		const allModuleDefects = moduleDefects.getAll();

		return {
			counter: {
				imports: allImportDefects.length,
				modules: allModuleDefects.length,
				total: allImportDefects.length + allModuleDefects.length,
			},
			defectDetailsMap: this.#getDefectDetailsMap({
				importDefects: allImportDefects,
				moduleDefects: allModuleDefects,
			}),
		};
	}

	#getPackageCounter() {
		return {
			total: this.#context.packages.all.length,
		};
	}

	#getTagCounter() {
		return {
			total: this.#context.tags.getAll().length,
		};
	}

	#getFrameCounter() {
		return {
			total: this.#context.frames.names.length,
		};
	}

	#getModuleCounter() {
		const { modules } = this.#context;
		const langRec = Object.fromEntries(langs.map((lang) => [lang, 0])) as Record<Lang, number>;

		const byLang = modules.all.reduce((acc, module) => {
			acc[module.lang] += 1;
			return acc;
		}, langRec);

		return {
			total: modules.all.length,
			byLang,
		};
	}

	#getImportCounter() {
		const byType = this.#context.imports.all.reduce<{ static: number; dynamic: number }>((acc, imp) => {
			acc[imp.isDynamic ? "dynamic" : "static"] += 1;
			return acc;
		}, { static: 0, dynamic: 0 });

		return {
			static: byType.static,
			dynamic: byType.dynamic,
			total: byType.dynamic + byType.static,
		};
	}

	#getDefectDetailsMap(
		{ importDefects, moduleDefects }: { importDefects: ImportDefect[]; moduleDefects: ModuleDefect[] },
	) {
		const { pathUtil } = this.#context;
		const map: Map<string, DefectDetails[]> = new Map();

		moduleDefects.forEach(({ sourcePath, rule, description }) => {
			const items = map.getOrInsert(sourcePath, []);

			items.push({
				kind: "module",
				rule,
				description,
				path: sourcePath,
				shortPath: pathUtil.getShortPath(sourcePath),
			});
		});

		importDefects.forEach(({ sourcePath, importedPath, line, code, rule, description }) => {
			const module = importedPath ? { path: importedPath, shortPath: pathUtil.getShortPath(importedPath) } : null;
			const items = map.getOrInsert(sourcePath, []);

			items.push({
				kind: "import",
				line,
				code,
				rule,
				module,
				description,
				path: sourcePath,
				shortPath: pathUtil.getShortPath(sourcePath),
			});
		});

		return map;
	}
}
