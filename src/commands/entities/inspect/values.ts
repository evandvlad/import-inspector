export type DefectDetails = ImportDefectDetails | ModuleDefectDetails;

export type ImportDefectDetails = {
	kind: "import";
	line: number;
	code: string;
	rule: string;
	path: string;
	description: string;
	shortPath: string;
	module: {
		path: string;
		shortPath: string;
	} | null;
};

export type ModuleDefectDetails = {
	kind: "module";
	rule: string;
	path: string;
	description: string;
	shortPath: string;
};
