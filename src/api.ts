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

export type Htmlx = {
	components: HtmlxComponents;
	createHtml: (value: string) => Promise<string>;
};

export type HtmlxComponentBaseOptions = {
	classes?: string[];
	attrs?: Rec<string>;
	styles?: Rec<string>;
};

export type HtmlxComponentTreeItem = {
	value: string;
	children?: HtmlxComponentTreeItem[];
};

export type HtmlxComponents = {
	h: (value: string, options?: { level?: 1 | 2 | 3 } & HtmlxComponentBaseOptions) => string;
	elem: (value: string, options?: HtmlxComponentBaseOptions) => string;
	flex: (items: string[], options?: { dir?: "v" | "h" } & HtmlxComponentBaseOptions) => string;
	cols: (items: string[], options?: HtmlxComponentBaseOptions) => string;
	link: (params: { url: string; value: string }, options?: HtmlxComponentBaseOptions) => string;
	flist: (items: Array<{ value: string; content: string }>, options?: HtmlxComponentBaseOptions) => string;
	mark: (value: string, options?: HtmlxComponentBaseOptions) => string;
	details: (
		params: { label: string; value: string },
		options?: { theme?: "standard" | "light" | "dark" } & HtmlxComponentBaseOptions,
	) => string;
	table: (rows: string[][], options?: { columns?: string[] } & HtmlxComponentBaseOptions) => string;
	expander: (params: { label: string; value: string }, options?: HtmlxComponentBaseOptions) => string;
	tabs: (items: Array<{ label: string; value: string }>, options?: HtmlxComponentBaseOptions) => string;
	tree: (items: HtmlxComponentTreeItem[], options?: HtmlxComponentBaseOptions) => string;
	code: (entries: FileContentEntry[], options?: HtmlxComponentBaseOptions) => string;
	json: (data: unknown, options?: HtmlxComponentBaseOptions) => string;
};

export type Clix = {
	components: ClixComponents;
	widgets: ClixWidgets;
};

export type ClixComponents = {
	text: (
		value: string,
		options?: { bold?: boolean; dim?: boolean; color?: "red" | "blue" | "gray" | "white" },
	) => string;
	lines: (items: string[]) => string;
	link: (path: string, options?: { text?: string; line?: number }) => string;
	code: (value: string, options?: { startLine?: number }) => string;
};

export type ClixWidgets = {
	spin: (message: string) => { stop: () => void };
	prompt: (options?: { label?: string; value?: string }) => string;
	confirm: (message: string) => boolean;
	select: <T extends string = string>(
		items: Array<{ label: string; value: T }>,
		options?: { label?: string },
	) => { label: string; value: T };
};

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

export type Task = (taskContext: TaskContext) => MaybePromise</* isError */ boolean | void>;

export type Settings = {
	rootEntries: RootEntry[];
	importRemaps?: Rec<string>;
	correctUnresolvedDynamicImports?: CorrectUnresolvedDynamicImports;
	preLint?: PreLint;
	postLint?: PostLint;
	reports?: Report[];
	tasks?: Rec<Task>;
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

export type ModuleDependencyItem = {
	source: Module;
	imported: Module;
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
	addDefect: (rule: string, description?: string) => void;
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
	addDefect: (rule: string, description?: string) => void;
	removeDefect: (rule: string) => void;
	hasTag: (tag: string) => boolean;
	setTag: (tag: string) => void;
	removeTag: (tag: string) => void;
	hasFrame: (frame: string) => boolean;
	setFrame: (frame: string) => void;
	removeFrame: (frame: string) => void;
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

export type Frames = {
	getAll: () => string[];
	getModulePathsByFrame: (name: string) => string[];
	isModuleInFrame: (params: { path: string; name: string }) => boolean;
	getImportedFramesMap: (name: string) => Map</* name */ string, ModuleDependencyItem[]>;
	toViewData: (mode?: ViewDataMode) => Json;
};

export type Modules = {
	getAll: () => Module[];
	find: (path: string) => Nullable<Module>;
	get: (path: string) => Module;
	toViewData: (mode?: ViewDataMode) => Json;
};

export type Packages = {
	getAll: () => Package[];
	getRoots: () => Package[];
	find: (path: string) => Nullable<Package>;
	get: (path: string) => Package;
	findParent: (path: string) => Nullable<Package>;
	getParent: (path: string) => Package;
	getSubs: (path: string) => Package[];
	isInAncestryBranch: (sourcePath: string, testablePath: string) => boolean;
	getAncestryBranch: (path: string) => Package[];
	toViewData: (mode?: ViewDataMode) => Json;
};

export type Tags = {
	getAll: () => string[];
	getModulePathsByTag: (tag: string) => string[];
	toViewData: (mode?: ViewDataMode) => Json;
};

export type Imports = {
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

export type ImportDefects = {
	getAll: () => ImportDefect[];
	getAllAsRuleMap: () => Map</* rule */ string, ImportDefect[]>;
	getAllAsModulePathMap: () => Map</* module path */ string, ImportDefect[]>;
	getAllRules: () => string[];
	getByRule: (rule: string) => ImportDefect[];
	getModulePathsByRule: (rule: string) => string[];
	remove: (importId: string, rule: string) => void;
	removeByRule: (rule: string) => void;
	removeAll: () => void;
	toViewData: (mode?: ViewDataMode) => Json;
};

export type ModuleDefects = {
	getAll: () => ModuleDefect[];
	getAllRules: () => string[];
	getAllAsPathMap: () => Map</* path */ string, ModuleDefect[]>;
	getAllAsRuleMap: () => Map</* rule */ string, ModuleDefect[]>;
	getByRule: (rule: string) => ModuleDefect[];
	remove: (path: string, rule: string) => void;
	removeByRule: (rule: string) => void;
	removeAll: () => void;
	toViewData: (mode?: ViewDataMode) => Json;
};

export type AppContextEnv = {
	htmlx: Htmlx;
	version: string;
	basePath: string;
	preset: ConfigPreset;
	getShortPath: (path: string) => string;
	getFullPath: (path: string) => string;
	getEditorUrl: (path: string, line?: number) => string;
	toViewData: (mode?: ViewDataMode) => Json;
};

export type AppContextSummary = {
	tags: number;
	frames: number;
	packages: number;
	modules: number;
	imports: number;
	importDefects: number;
	moduleDefects: number;
	totalDefects: number;
};

export type AppContext = {
	env: AppContextEnv;
	modules: Modules;
	packages: Packages;
	imports: Imports;
	tags: Tags;
	frames: Frames;
	importDefects: ImportDefects;
	moduleDefects: ModuleDefects;
	toViewData: (mode?: ViewDataMode) => Json;
	getSummary: () => AppContextSummary;
};

export type TaskContextComponents = {
	code: (path: string, lineRange?: LineRange) => string;
	lintResult: () => string;
	summary: () => string;
};

export type TaskContext = {
	clix: Clix;
	components: TaskContextComponents;
	appContext: AppContext;

	taskName?: string;
	taskArgs: string[];
};
