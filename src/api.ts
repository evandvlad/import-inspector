type Rec<T> = Record<string, T>;
type Nullable<T> = T | null;
type MaybePromise<T> = T | Promise<T>;

export type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

export const langs = ["ts", "js"] as const;

export type Lang = typeof langs[number];

export type Span = {
	start: number;
	end: number;
};

export type LineRange = [line: number] | [startLine: number, endLine: number];

export enum Tag {
	Test = "test",
	EntryPoint = "entry-point",
	Declaration = "declaration",
	Independent = "independent",
}

export enum ImportLintRule {
	DontReferToPackageEntryInside = "don't-refer-to-package-entry-inside",
	DontJumpThroughPackageEntry = "don't-jump-through-package-entry",
	DontUseAbsolutePathInside = "don't-use-absolute-path-inside",
	DontImportEntryFile = "don't-import-entry-file",
}

export enum ModuleLintRule {
	DontLeaveUnusedModule = "don't-leave-unused-module",
}

export type ViewDataMode = "verbose" | "brief" | "minimal";

export type RootEntry = {
	// absolute path
	path: string;
	alias?: string;
};

export type Report = {
	format: "text" | "json" | "html";
	// absolute path
	path: string;
	provide: (appContext: AppContext) => MaybePromise<unknown>;
};

export type ConfigPreset = {
	name: string;
	// absolute path
	settingsPath: string;
	// absolute path
	projectPath: string;
};

export type Config = {
	presets: Rec</* name */ ConfigPreset>;
};

export type SettingsModule = {
	default: (preset: ConfigPreset) => Promise<Settings>;
};

export type UnresolvedDynamicImportData = {
	sourcePath: string;
	posSpan: Span;
	fileContent: FileContent;
};

export type CorrectUnresolvedDynamicImports = (
	params: UnresolvedDynamicImportData,
	// result - array of import locators
) => Promise<string[]>;

export type PreLint = (appContext: AppContext) => MaybePromise<void>;
export type PostLint = (appContext: AppContext) => MaybePromise<void>;

export type Settings = {
	rootEntries: RootEntry[];
	importRemaps?: Rec<string>;
	frames?: Rec</* name: root path prefixes */ string[]>;
	correctUnresolvedDynamicImports?: CorrectUnresolvedDynamicImports;
	preLint?: PreLint;
	postLint?: PostLint;
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
	getLineRange: (span: Span) => LineRange;
	getContentBySpan: (span: Span) => string;
	getEntriesBySpan: (span: Span) => FileContentEntry[];
	getContentByLineRange: (lineRange: LineRange) => string;
	getEntriesByLineRange: (lineRange: LineRange) => FileContentEntry[];
	toViewData: (mode?: ViewDataMode) => Json;
};

export type Import = {
	id: string;
	sourcePath: string;
	locator: Nullable<string>;
	location: Nullable<string>;
	posSpan: Span;
	isDynamic: boolean;
	resolution: Nullable<ImportResolution>;
	resolutionPath: Nullable<string>;
	defects: ImportDefect[];
	hasDefect: (rule: string) => boolean;
	findDefect: (rule: string) => Nullable<ImportDefect>;
	getDefect: (rule: string) => ImportDefect;
	addDefect: (params: { rule: string; description?: string }) => void;
	removeDefect: (rule: string) => void;
	toViewData: (mode?: ViewDataMode) => Json;
};

export type ImportDefect = {
	rule: string;
	info: string;
	posSpan: Span;
	importId: string;
	sourcePath: string;
	description: string;
	locator: Nullable<string>;
	imported: Nullable<string>;
	importedPath: Nullable<string>;
	toViewData: (mode?: ViewDataMode) => Json;
};

export type ModuleDefect = {
	rule: string;
	info: string;
	sourcePath: string;
	description: string;
	toViewData: (mode?: ViewDataMode) => Json;
};

export type Module = {
	name: string;
	lang: Lang;
	path: string;
	tags: string[];
	frames: string[];
	fileContent: FileContent;
	parentDirPath: Nullable<string>;
	packagePath: Nullable<string>;
	isInPackage: boolean;
	isPackageEntryPoint: boolean;
	links: /* path */ string[];
	imports: Import[];
	defects: ModuleDefect[];
	hasDefect: (rule: string) => boolean;
	findDefect: (rule: string) => Nullable<ModuleDefect>;
	getDefect: (rule: string) => ModuleDefect;
	addDefect: (params: { rule: string; description?: string }) => void;
	removeDefect: (rule: string) => void;
	hasTag: (tag: string) => boolean;
	setTag: (tag: string) => void;
	removeTag: (tag: string) => void;
	hasFrame: (frame: string) => boolean;
	toViewData: (mode?: ViewDataMode) => Json;
};

export type Package = {
	name: string;
	path: string;
	parentDirPath: Nullable<string>;
	parentPackagePath: Nullable<string>;
	hasParentPackage: boolean;
	subPackagePaths: string[];
	modulePaths: string[];
	toViewData: (mode?: ViewDataMode) => Json;
};

export type Htmlx = {
	components: HtmlxComponents;
	createHtml: (value: string) => Promise<string>;
};

export type HtmlxComponentBaseProps = {
	classes?: string[];
	attrs?: Rec<string>;
	styles?: Rec<string>;
};

export type HtmlxComponent<P extends Rec<unknown> = Rec<unknown>> = (
	params: P & HtmlxComponentBaseProps,
) => string;

export type HtmlxComponentTreeItem = {
	value: string;
	children?: HtmlxComponentTreeItem[];
};

export type HtmlxComponents = {
	h: HtmlxComponent<{ value: string; level: 1 | 2 | 3 }>;
	elem: HtmlxComponent<{ value: string }>;
	flex: HtmlxComponent<{ items: string[]; dir?: "v" | "h" }>;
	cols: HtmlxComponent<{ items: string[] }>;
	link: HtmlxComponent<{ url: string; value: string }>;
	flist: HtmlxComponent<{ items: Array<{ value: string; content: string }> }>;
	mark: HtmlxComponent<{ value: string }>;
	details: HtmlxComponent<{ label: string; value: string; theme?: "standard" | "light" | "dark" }>;
	table: HtmlxComponent<{ rows: string[][]; columns?: string[] }>;
	expander: HtmlxComponent<{ label: string; value: string }>;
	tabs: HtmlxComponent<{ items: Array<{ label: string; value: string }> }>;
	tree: HtmlxComponent<{ items: HtmlxComponentTreeItem[] }>;
	code: HtmlxComponent<{ entries: FileContentEntry[] }>;
	json: HtmlxComponent<{ data: unknown }>;
};

export type ContextFramesModuleDependencyItem = {
	source: Module;
	imported: Module;
};

export type AppContextEnv = {
	htmlx: Htmlx;
	version: string;
	basePath: string;
	preset: ConfigPreset;
	getShortPath: (path: string) => string;
	getEditorUrl: (path: string, line?: number) => string;
	toViewData: (mode?: ViewDataMode) => Json;
};

export type ContextFrames = {
	getAll: () => string[];
	getPathPrefixes: (name: string) => string[];
	getModulePathsByFrame: (name: string) => string[];
	isModuleInFrame: (params: { path: string; name: string }) => boolean;
	getImportedFramesMap: (name: string) => Map</* name */ string, ContextFramesModuleDependencyItem[]>;
	toViewData: (mode?: ViewDataMode) => Json;
};

export type ContextModules = {
	getAll: () => Module[];
	find: (path: string) => Nullable<Module>;
	get: (path: string) => Module;
	toViewData: (mode?: ViewDataMode) => Json;
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
	toViewData: (mode?: ViewDataMode) => Json;
};

export type ContextTags = {
	getAll: () => string[];
	getModulePathsByTag: (tag: string) => string[];
	toViewData: (mode?: ViewDataMode) => Json;
};

export type ContextImports = {
	getAll: () => Import[];
	find: (id: string) => Nullable<Import>;
	get: (id: string) => Import;
	getLocal: () => Import[];
	getExternal: () => Import[];
	getFullResolved: () => Import[];
	getFullUnresolved: () => Import[];
	getLocalUnresolved: () => Import[];
	getDynamic: () => Import[];
	getStatic: () => Import[];
	getExternalMap: () => Map</* name */ string, Import[]>;
	toViewData: (mode?: ViewDataMode) => Json;
};

export type ContextImportDefects = {
	getAll: () => ImportDefect[];
	getAllAsRuleMap: () => Map</* rule */ string, ImportDefect[]>;
	getAllAsModulePathMap: () => Map</* module path */ string, ImportDefect[]>;
	getAllRules: () => string[];
	getByRule: (rule: string) => ImportDefect[];
	getModulePathsByRule: (rule: string) => string[];
	remove: (params: { importId: string; rule: string }) => void;
	removeByRule: (rule: string) => void;
	removeAll: () => void;
	toViewData: (mode?: ViewDataMode) => Json;
};

export type ContextModuleDefects = {
	getAll: () => ModuleDefect[];
	getAllRules: () => string[];
	getAllAsPathMap: () => Map</* path */ string, ModuleDefect[]>;
	getAllAsRuleMap: () => Map</* rule */ string, ModuleDefect[]>;
	getByRule: (rule: string) => ModuleDefect[];
	remove: (params: { path: string; rule: string }) => void;
	removeByRule: (rule: string) => void;
	removeAll: () => void;
	toViewData: (mode?: ViewDataMode) => Json;
};

export type AppContext = {
	env: AppContextEnv;
	modules: ContextModules;
	packages: ContextPackages;
	imports: ContextImports;
	tags: ContextTags;
	frames: ContextFrames;
	importDefects: ContextImportDefects;
	moduleDefects: ContextModuleDefects;
	toViewData: (mode?: ViewDataMode) => Json;
};
