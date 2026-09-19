import type { LineRange } from "~/api.ts";

export type DefectDetails = ImportDefectDetails | ModuleDefectDetails;

export type ImportDefectDetails = {
	kind: "import";
	code: string;
	rule: string;
	path: string;
	shortPath: string;
	description: string;
	lineRange: LineRange;
	module: {
		path: string;
		shortPath: string;
	} | null;
};

export type ModuleDefectDetails = {
	kind: "module";
	rule: string;
	path: string;
	shortPath: string;
	description: string;
};
