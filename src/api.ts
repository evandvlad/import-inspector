export const langs = ["ts", "js"] as const;

export type Lang = typeof langs[number];

export type Span = {
	start: number;
	end: number;
};

export enum Tag {
	Test = "test",
	EntryPoint = "entry-point",
	Declaration = "declaration",
	Independent = "independent",
}

export enum ImportInspectionRule {
	DontReferToPackageEntryInside = "don't-refer-to-package-entry-inside",
	DontJumpThroughPackageEntry = "don't-jump-through-package-entry",
	DontUseAbsolutePathInside = "don't-use-absolute-path-inside",
	DontImportEntryFile = "don't-import-entry-file",
}

export enum ModuleInspectionRule {
	DontLeaveUnusedModule = "don't-leave-unused-module",
}

export type RootEntry = {
	// absolute path
	path: string;
	alias?: string;
};

export type Report = {
	format: "text" | "json" | "yaml";
	// absolute path
	path: string;
	provide: (context: Context) => unknown | Promise<unknown>;
};

export type ConfigData = {
	presets: Record<string, /* absolute path */ string>;
};

export type SettingsModule = {
	default: Settings;
};

export type CorrectUnresolvedDynamicImports = (
	params: { sourcePath: string; posSpan: Span; fileContent: FileContent },
	// result - array of import locators
) => Promise<string[]>;

export type PreInspect = (context: Context) => void | Promise<void>;
export type PostInspect = (context: Context) => void | Promise<void>;

export type Settings = {
	rootEntries: RootEntry[];
	importRemaps?: Record<string, string>;
	frames?: Record</* name */ string, /* root path prefixes */ string[]>;
	correctUnresolvedDynamicImports?: CorrectUnresolvedDynamicImports;
	preInspect?: PreInspect;
	postInspect?: PostInspect;
	reports?: Report[];
};

export type ImportResolution = {
	path: string | null;
	isExternal: boolean;
	isRelative: boolean;
};

export type FileContentEntry = {
	line: number;
	posSpan: Span;
	value: string;
};

export type FileContent = {
	value: string;
	entries: FileContentEntry[];
	getContent: (span: Span) => string;
	getEntries: (span: Span) => FileContentEntry[];
	getFirstLine: (span: Span) => number;
};

export type Import = {
	id: string;
	sourcePath: string;
	locator: string | null;
	posSpan: Span;
	isDynamic: boolean;
	resolution: ImportResolution | null;
	defectMap: Map</* rule */ string, ImportDefect>;
	addDefect: (params: { rule: string; description?: string }) => void;
	removeDefect: (rule: string) => void;
};

export type ImportDefect = {
	rule: string;
	posSpan: Span;
	importId: string;
	sourcePath: string;
	description: string;
	locator: string | null;
	importedPath: string | null;
};

export type ModuleDefect = {
	rule: string;
	sourcePath: string;
	description: string;
};

export type Module = {
	name: string;
	lang: Lang;
	path: string;
	fileContent: FileContent;
	parentDirPath: string | null;
	packagePath: string | null;
	isPackageEntryPoint: boolean;
	tagSet: Set<string>;
	frameSet: Set<string>;
	links: /* path */ string[];
	importMap: Map</* id */ string, Import>;
	defectMap: Map</* rule */ string, ModuleDefect>;
	addDefect: (params: { rule: string; description?: string }) => void;
	removeDefect: (rule: string) => void;
	setTag: (tag: string) => void;
	removeTag: (tag: string) => void;
};

export type Package = {
	name: string;
	path: string;
	parentDirPath: string | null;
	parentPackagePath: string | null;
	subPackagePaths: string[];
	modulePaths: string[];
};

export type ContextEnv = {
	basePath: string;
	getShortPath: (path: string) => string;
};

export type ContextFrames = {
	getAll: () => string[];
	getModulesByFrame: (name: string) => Module[];
	isModuleInFrame: (params: { path: string; name: string }) => boolean;
};

export type ContextModules = {
	getAll: () => Module[];
	find: (path: string) => Module | null;
	get: (path: string) => Module;
};

export type ContextPackages = {
	getAll: () => Package[];
	getRoots: () => Package[];
	find: (path: string) => Package | null;
	get: (path: string) => Package;
	isInAncestryBranch: (params: { sourcePath: string; testablePath: string }) => boolean;
	isInSameOrAncestryBranch: (params: { sourcePath: string; testablePath: string }) => boolean;
	getSubs: (path: string) => Package[];
	getAncestryBranch: (path: string) => Package[];
	getWithAncestryBranch: (path: string) => Package[];
};

export type ContextTags = {
	getAll: () => string[];
	getModulesByTag: (tag: string) => Module[];
};

export type ContextImports = {
	getAll: () => Import[];
	find: (id: string) => Import | null;
	get: (id: string) => Import;
	getFullResolved: () => Import[];
	getUnresolved: () => Import[];
	getDynamic: () => Import[];
	getStatic: () => Import[];
	getDynamicUnresolved: () => Import[];
	getExternal: () => Import[];
	findModule: (id: string) => Module | null;
	getModule: (id: string) => Module;
};

export type ContextImportDefects = {
	getAll: () => ImportDefect[];
	getAllRules: () => string[];
	getByImportId: (importId: string) => ImportDefect[];
	getByRule: (rule: string) => ImportDefect[];
	getModulesByRule: (rule: string) => Module[];
	remove: (params: { importId: string; rule: string }) => void;
	removeByRule: (rule: string) => void;
	removeAll: () => void;
};

export type ContextModuleDefects = {
	getAll: () => ModuleDefect[];
	getAllRules: () => string[];
	getByRule: (rule: string) => ModuleDefect[];
	remove: (params: { path: string; rule: string }) => void;
	removeByRule: (rule: string) => void;
	removeAll: () => void;
};

export type Context = {
	env: ContextEnv;
	modules: ContextModules;
	packages: ContextPackages;
	imports: ContextImports;
	tags: ContextTags;
	frames: ContextFrames;
	importDefects: ContextImportDefects;
	moduleDefects: ContextModuleDefects;
};
