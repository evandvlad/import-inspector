export const langs = ["ts", "js"] as const;

export type Lang = typeof langs[number];

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

export type CustomLogger = {
	format: "log" | "json" | "yaml" | "md";
	name: string;
	provide: (context: Context) => unknown | Promise<unknown>;
};

export type ConfigData = {
	presets: Record<string, /* absolute path */ string>;
};

export type SettingsModule = {
	default: Settings;
};

export type CorrectUnresolvedDynamicImports = (
	params: { line: number; sourcePath: string; code: string },
	// result - array of import locators
) => Promise<string[]>;

export type PreInspect = (context: Context) => void | Promise<void>;
export type PostInspect = (context: Context) => void | Promise<void>;

export type Settings = {
	rootEntries: RootEntry[];
	importRemaps?: Record<string, string>;
	frames?: Record<
		/* name */ string,
		/* root path prefixes */ string[]
	>;
	correctUnresolvedDynamicImports?: CorrectUnresolvedDynamicImports;
	preInspect?: PreInspect;
	postInspect?: PostInspect;
	customLoggers?: CustomLogger[];
	// absolute path
	logsDir?: string;
};

export type ImportResolution = {
	readonly path: string | null;
	readonly isExternal: boolean;
	readonly isRelative: boolean;
};

export type Import = {
	readonly id: string;
	readonly line: number;
	readonly sourcePath: string;
	readonly locator: string | null;
	readonly code: string;
	readonly isDynamic: boolean;
	readonly resolution: ImportResolution | null;
	readonly defectMap: ReadonlyMap<
		/* rule */
		string,
		ImportDefect
	>;
	addDefect: (params: { rule: string; description?: string }) => void;
	removeDefect: (rule: string) => void;
};

export type ImportDefect = {
	readonly rule: string;
	readonly line: number;
	readonly code: string;
	readonly importId: string;
	readonly sourcePath: string;
	readonly description: string;
	readonly locator: string | null;
	readonly importedPath: string | null;
};

export type ModuleDefect = {
	readonly rule: string;
	readonly sourcePath: string;
	readonly description: string;
};

export type Module = {
	readonly name: string;
	readonly lang: Lang;
	readonly path: string;
	readonly parentDirPath: string | null;
	readonly packagePath: string | null;
	readonly isPackageEntryPoint: boolean;
	readonly tagSet: ReadonlySet<string>;
	readonly frameSet: ReadonlySet<string>;
	readonly links: ReadonlyArray</* path */ string>;
	readonly importMap: ReadonlyMap</* id */ string, Import>;
	readonly defectMap: ReadonlyMap</* rule */ string, ModuleDefect>;
	addDefect: (params: { rule: string; description?: string }) => void;
	removeDefect: (rule: string) => void;
	setTag: (tag: string) => void;
	removeTag: (tag: string) => void;
};

export type Package = {
	readonly name: string;
	readonly path: string;
	readonly parentDirPath: string | null;
	readonly parentPackagePath: string | null;
	readonly subPackagePaths: ReadonlyArray<string>;
	readonly modulePaths: ReadonlyArray<string>;
};

export type ContextPathUtil = {
	getShortPath: (path: string) => string;
};

export type ContextFrames = {
	readonly names: ReadonlyArray<string>;
	getModulesByFrame: (name: string) => ReadonlyArray<Module>;
	isModuleInFrame: (params: { path: string; name: string }) => boolean;
};

export type ContextModules = {
	readonly all: ReadonlyArray<Module>;
	find: (path: string) => Module | null;
	get: (path: string) => Module;
};

export type ContextPackages = {
	readonly all: ReadonlyArray<Package>;
	readonly roots: ReadonlyArray<Package>;
	find: (path: string) => Package | null;
	get: (path: string) => Package;
	isInAncestryBranch: (params: { sourcePath: string; testablePath: string }) => boolean;
	isInSameOrAncestryBranch: (params: { sourcePath: string; testablePath: string }) => boolean;
	getSubs: (path: string) => ReadonlyArray<Package>;
	getAncestryBranch: (path: string) => ReadonlyArray<Package>;
	getWithAncestryBranch: (path: string) => ReadonlyArray<Package>;
};

export type ContextTags = {
	getAll: () => ReadonlyArray<string>;
	getModulesByTag: (tag: string) => ReadonlyArray<Module>;
};

export type ContextImports = {
	readonly all: ReadonlyArray<Import>;
	find: (id: string) => Import | null;
	get: (id: string) => Import;
	getFullResolved: () => ReadonlyArray<Import>;
	getDynamic: () => ReadonlyArray<Import>;
	findModule: (id: string) => Module | null;
	getModule: (id: string) => Module;
};

export type ContextImportDefects = {
	getAll: () => ReadonlyArray<ImportDefect>;
	getAllRules: () => ReadonlyArray<string>;
	getByImportId: (importId: string) => ReadonlyArray<ImportDefect>;
	getByRule: (rule: string) => ReadonlyArray<ImportDefect>;
	getModulesByRule: (rule: string) => ReadonlyArray<Module>;
	remove: (params: { importId: string; rule: string }) => void;
	removeByRule: (rule: string) => void;
	removeAll: () => void;
};

export type ContextModuleDefects = {
	getAll: () => ReadonlyArray<ModuleDefect>;
	getAllRules: () => ReadonlyArray<string>;
	getByRule: (rule: string) => ReadonlyArray<ModuleDefect>;
	remove: (params: { path: string; rule: string }) => void;
	removeByRule: (rule: string) => void;
	removeAll: () => void;
};

export type Context = {
	readonly pathUtil: ContextPathUtil;
	readonly modules: ContextModules;
	readonly packages: ContextPackages;
	readonly imports: ContextImports;
	readonly tags: ContextTags;
	readonly frames: ContextFrames;
	readonly importDefects: ContextImportDefects;
	readonly moduleDefects: ContextModuleDefects;
};
