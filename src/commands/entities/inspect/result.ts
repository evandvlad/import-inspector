import { type Context, type ImportDefect, type Lang, langs, type ModuleDefect } from "~/api.ts";

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
			total: this.#context.packages.getAll().length,
		};
	}

	#getTagCounter() {
		return {
			total: this.#context.tags.getAll().length,
		};
	}

	#getFrameCounter() {
		return {
			total: this.#context.frames.getAll().length,
		};
	}

	#getModuleCounter() {
		const { modules } = this.#context;
		const langRec = Object.fromEntries(langs.map((lang) => [lang, 0])) as Record<Lang, number>;
		const allModules = modules.getAll();

		const byLang = allModules.reduce((acc, module) => {
			acc[module.lang] += 1;
			return acc;
		}, langRec);

		return {
			total: allModules.length,
			byLang,
		};
	}

	#getImportCounter() {
		const dynamicImportsLength = this.#context.imports.getDynamic().length;
		const staticImportsLength = this.#context.imports.getStatic().length;

		return {
			static: staticImportsLength,
			dynamic: dynamicImportsLength,
			total: dynamicImportsLength + staticImportsLength,
		};
	}

	#getDefectDetailsMap(
		{ importDefects, moduleDefects }: {
			importDefects: ImportDefect[];
			moduleDefects: ModuleDefect[];
		},
	) {
		const { env, modules } = this.#context;
		const map: Map<string, DefectDetails[]> = new Map();

		moduleDefects.forEach(({ sourcePath, rule, description }) => {
			const items = map.getOrInsert(sourcePath, []);

			items.push({
				kind: "module",
				rule,
				description,
				path: sourcePath,
				shortPath: env.getShortPath(sourcePath),
			});
		});

		importDefects.forEach(({ sourcePath, importedPath, posSpan, rule, description }) => {
			const { fileContent } = modules.get(sourcePath);
			const module = importedPath ? { path: importedPath, shortPath: env.getShortPath(importedPath) } : null;
			const items = map.getOrInsert(sourcePath, []);

			items.push({
				kind: "import",
				rule,
				module,
				description,
				path: sourcePath,
				shortPath: env.getShortPath(sourcePath),
				code: fileContent.getContent(posSpan),
				line: fileContent.getFirstLine(posSpan),
			});
		});

		return map;
	}
}
