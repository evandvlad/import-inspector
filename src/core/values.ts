import type { Lang } from "~/api.ts";

import type { FilePathRec } from "./path-rec-provider/index.ts";
import type { Context } from "./context/index.ts";

export type FileExtInfo = {
	lang: Lang;
	canUseReactSyntax: boolean;
	canBeDeclaration: boolean;
	importResolutionOrder: number;
};

export type ImportRec = {
	filePathRec: FilePathRec;
	line: number;
	// Can be null for dynamic imports
	locator: string | null;
	code: string;
	isDynamic: boolean;
};

export type FileParsingResult = {
	filePathRec: FilePathRec;
	importRecs: ImportRec[];
};

export type ImportResolution = {
	path: string | null;
	isExternal: boolean;
	isRelative: boolean;
};

export type InspectionHandler = (context: Context) => void;
