import type { Context } from "~/api.ts";

export type ImportRec = {
	sourcePath: string;
	line: number;
	// Can be null for dynamic imports
	locator: string | null;
	code: string;
	isDynamic: boolean;
};

export type FileParsingResult = {
	path: string;
	importRecs: ImportRec[];
};

export type ImportResolution = {
	path: string | null;
	isExternal: boolean;
	isRelative: boolean;
};

export type InspectionHandler = (context: Context) => void;
