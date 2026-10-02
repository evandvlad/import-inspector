import type { Context, FileContent, Span } from "~/api.ts";

export type ImportRec = {
	// Can be null for dynamic imports
	locator: string | null;
	isDynamic: boolean;
	posSpan: Span;
};

export type FileParsingResult = {
	path: string;
	fileContent: FileContent;
	importRecs: ImportRec[];
};

export type ImportResolution = {
	path: string | null;
	isExternal: boolean;
	isRelative: boolean;
};

export type InspectionHandler = (context: Context) => void;
