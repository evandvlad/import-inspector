type Rec<T> = Record<string, T>;
type Nullable<T> = T | null;
type MaybePromise<T> = T | Promise<T>;

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
	format: "text" | "json" | "yaml" | "html";
	// absolute path
	path: string;
	provide: (context: Context) => MaybePromise<unknown>;
};

export type ConfigData = {
	presets: Rec</* absolute path */ string>;
};

export type SettingsModule = {
	default: Settings;
};

export type CorrectUnresolvedDynamicImports = (
	params: { sourcePath: string; posSpan: Span; fileContent: FileContent },
	// result - array of import locators
) => Promise<string[]>;

export type PreInspect = (context: Context) => MaybePromise<void>;
export type PostInspect = (context: Context) => MaybePromise<void>;

export type Settings = {
	rootEntries: RootEntry[];
	importRemaps?: Rec<string>;
	frames?: Rec</* name: root path prefixes */ string[]>;
	correctUnresolvedDynamicImports?: CorrectUnresolvedDynamicImports;
	preInspect?: PreInspect;
	postInspect?: PostInspect;
	reports?: Report[];
};

export type ImportResolution = {
	path: Nullable<string>;
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
	locator: Nullable<string>;
	posSpan: Span;
	isDynamic: boolean;
	resolution: Nullable<ImportResolution>;
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
	locator: Nullable<string>;
	importedPath: Nullable<string>;
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
	parentDirPath: Nullable<string>;
	packagePath: Nullable<string>;
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
	parentDirPath: Nullable<string>;
	parentPackagePath: Nullable<string>;
	subPackagePaths: string[];
	modulePaths: string[];
};

export type HtmlxComponentBaseProps<T extends string = string> = {
	class?: string;
	attrs?: Rec<string>;
	mods?: T[];
};

type HtmlxComponent<P extends Record<string, unknown>, M extends string = string> = (
	params: P & HtmlxComponentBaseProps<M>,
) => string;

export type HtmlxComponentRawFormat = "json" | "yaml";

export type HtmlxComponents = {
	link: HtmlxComponent<{ url: string; value: string }, "single-line">;
	list: HtmlxComponent<{ items: string[]; ordered?: boolean }, "inline">;
	dl: HtmlxComponent<{ items: Array<[key: string, value: string]> }>;
	details: HtmlxComponent<{ summary: string; value: string }>;
	grid: HtmlxComponent<{ items: string[] }>;
	table: HtmlxComponent<{ rows: string[][]; columns?: string[] }>;
	expander: HtmlxComponent<{ summary: string; value: string }>;
	tabs: HtmlxComponent<{ items: Array<[key: string, value: string]> }>;
	code: HtmlxComponent<{ value: string }>;
	raw: HtmlxComponent<{ data: unknown; format: HtmlxComponentRawFormat }>;
};

export type ContextEnv = {
	basePath: string;
	htmlxComponents: HtmlxComponents;
	getShortPath: (path: string) => string;
	getVSCodeUrl: (path: string, line?: number) => string;
};

export type ContextFrames = {
	getAll: () => string[];
	getModulesByFrame: (name: string) => Module[];
	isModuleInFrame: (params: { path: string; name: string }) => boolean;
};

export type ContextModules = {
	getAll: () => Module[];
	find: (path: string) => Nullable<Module>;
	get: (path: string) => Module;
};

export type ContextPackages = {
	getAll: () => Package[];
	getRoots: () => Package[];
	find: (path: string) => Nullable<Package>;
	get: (path: string) => Package;
	findParent: (path: string) => Nullable<Package>;
	getParent: (path: string) => Package;
	getSubs: (path: string) => Package[];
	isInAncestryBranch: (params: { sourcePath: string; testablePath: string }) => boolean;
	getAncestryBranch: (path: string) => Package[];
};

export type ContextTags = {
	getAll: () => string[];
	getModulesByTag: (tag: string) => Module[];
};

export type ContextImports = {
	getAll: () => Import[];
	find: (id: string) => Nullable<Import>;
	get: (id: string) => Import;
	getFullResolved: () => Import[];
	getUnresolved: () => Import[];
	getDynamic: () => Import[];
	getStatic: () => Import[];
	getDynamicUnresolved: () => Import[];
	getExternal: () => Import[];
	findModule: (id: string) => Nullable<Module>;
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
