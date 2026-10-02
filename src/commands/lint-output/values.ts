import type { LineRange } from "~/api.ts";

export type DefectDetails = ImportDefectDetails | ModuleDefectDetails;

export type ImportDefectDetails = {
	kind: "import";
	code: string;
	info: string;
	path: string;
	shortPath: string;
	lineRange: LineRange;
	mod: {
		path: string;
		shortPath: string;
	} | null;
};

export type ModuleDefectDetails = {
	kind: "module";
	info: string;
	path: string;
	shortPath: string;
};
