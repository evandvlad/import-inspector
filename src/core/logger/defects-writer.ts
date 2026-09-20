import { join } from "~/lib/upath.ts";
import type { Context } from "~/api.ts";

import { formatYaml } from "../lib/format.ts";

import { writeToFile } from "./helpers.ts";
import { LogFileName } from "./values.ts";

type ImportDefectItem = {
	line: number;
	code: string;
	rule: string;
	importedPath: string | null;
	description?: string;
};

type ModuleDefectItem = {
	rule: string;
	description?: string;
};

function getImportDefects({ importDefects, env }: Context) {
	const defects: Record<string, ImportDefectItem[]> = {};
	let total = 0;

	importDefects.getAll().forEach(({ sourcePath, importedPath, line, code, rule, description }) => {
		const shortPath = env.getShortPath(sourcePath);

		if (!Object.hasOwn(defects, shortPath)) {
			defects[shortPath] = [];
		}

		const item: ImportDefectItem = {
			line,
			code,
			rule,
			importedPath: importedPath ? env.getShortPath(importedPath) : null,
		};

		if (description) {
			item.description = description;
		}

		defects[shortPath].push(item);
		total += 1;
	});

	return {
		defects,
		total,
	};
}

function getModuleDefects({ moduleDefects, env }: Context) {
	const defects: Record<string, ModuleDefectItem[]> = {};
	let total = 0;

	moduleDefects.getAll().forEach(({ sourcePath, rule, description }) => {
		const shortPath = env.getShortPath(sourcePath);

		if (!Object.hasOwn(defects, shortPath)) {
			defects[shortPath] = [];
		}

		const item: ModuleDefectItem = { rule };

		if (description) {
			item.description = description;
		}

		defects[shortPath].push(item);
		total += 1;
	});

	return {
		defects,
		total,
	};
}

export async function writeDefects({ logsDir, context }: { logsDir: string; context: Context }) {
	await Promise.all([
		writeToFile({
			path: join(logsDir, LogFileName.ImportDefects),
			content: formatYaml(getImportDefects(context)),
		}),
		writeToFile({
			path: join(logsDir, LogFileName.ModuleDefects),
			content: formatYaml(getModuleDefects(context)),
		}),
	]);
}
