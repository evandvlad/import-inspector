type Rec<T> = Record<string, T>;
type Entry<T> = [key: string, value: T];
type Nullable<T> = T | null;
type MaybePromise<T> = T | Promise<T>;

export interface Dict<T> {
	size: number;
	has: (key: string) => boolean;
	set: (key: string, value: T) => this;
	remove: (key: string) => this;
	clear: () => this;
	get: (key: string) => T;
	getOrDefault: (key: string, defaultValue?: T) => T | undefined;
	getOrInsert: (key: string, value: T) => T;
	find: (callback: (value: T, key: string) => unknown) => T | undefined;
	findE: (callback: (value: T, key: string) => unknown) => Entry<T> | undefined;
	forEach: (callback: (value: T, key: string) => void) => this;
	filter: (callback: (value: T, key: string) => unknown) => Dict<T>;
	pick: (keys: string[]) => Dict<T>;
	omit: (keys: string[]) => Dict<T>;
	map: <U>(callback: (value: T, key: string) => U) => Dict<U>;
	mapK: (callback: (value: T, key: string) => string) => Dict<T>;
	mapE: <U>(callback: (value: T, key: string) => Entry<U>) => Dict<U>;
	slice: (start?: number, end?: number) => Dict<T>;
	some: (callback: (value: T, key: string) => unknown) => boolean;
	every: (callback: (value: T, key: string) => unknown) => boolean;
	sortK: (callback?: (key1: string, key2: string) => number) => Dict<T>;
	sortE: (callback: (entry1: Entry<T>, entry2: Entry<T>) => number) => Dict<T>;
	reduce: <U>(callback: (acc: U, value: T, key: string) => U, init: U) => U;
	group: (callback: (value: T, key: string) => string) => Dict<T[]>;
	keys: () => MapIterator<string>;
	values: () => MapIterator<T>;
	entries: () => MapIterator<Entry<T>>;
	toList: () => T[];
	toEntries: () => Array<Entry<T>>;
	toKeys: () => string[];
	toMap: () => Map<string, T>;
	toRec: () => Rec<T>;
	toJSON: () => Rec<T>;
}

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

export type HtmlxComponentBaseOptions = {
	classes?: string[];
	attrs?: Rec<string>;
	styles?: Rec<string>;
};

export type HtmlxComponentTreeItem = {
	value: string;
	opened?: boolean;
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
	table: (rows: string[][], options?: HtmlxComponentBaseOptions) => string;
	expander: (params: { label: string; value: string }, options?: HtmlxComponentBaseOptions) => string;
	tabs: (items: Array<{ label: string; value: string }>, options?: HtmlxComponentBaseOptions) => string;
	tree: (items: HtmlxComponentTreeItem[], options?: { subtree?: boolean } & HtmlxComponentBaseOptions) => string;
	code: (entries: Array<{ line: number; value: string }>, options?: HtmlxComponentBaseOptions) => string;
	data: (value: unknown, options?: HtmlxComponentBaseOptions) => string;
};

export type TuixColor = "red" | "blue" | "gray" | "white";

export type TuixSelectItem<T extends string = string> = {
	label: string;
	value: T;
};

export type Tuix = {
	text: (value: string, options?: { bold?: boolean; dim?: boolean; color?: TuixColor }) => string;
	lines: (items: string[]) => string;
	link: (path: string, options?: { text?: string; line?: number }) => string;
	code: (value: string, options?: { startLine?: number }) => string;
	spin: (message: string) => { stop: () => void };
	prompt: (options?: { label?: string; value?: string }) => string;
	confirm: (message: string) => boolean;
	select: <T extends string = string>(items: TuixSelectItem<T>[], options?: { label?: string }) => TuixSelectItem<T>;
	clear: () => void;
	print: (value: string | string[]) => void;
	eprint: (value: string | string[], options?: { noColor?: boolean }) => void;
	printData: (data: unknown) => void;
};

export type RootEntry = {
	// absolute path
	path: string;
	alias?: string;
};

export type Report = {
	// absolute path
	path: string;
	provide: (appContext: AppContext) => MaybePromise<string>;
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

export type Task = (taskContext: TaskContext) => MaybePromise</* exit code */ number | void>;

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
};

export type ModuleDefect = {
	rule: string;
	info: string;
	sourcePath: string;
	description: string;
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
	hasTag: (name: string) => boolean;
	setTag: (name: string) => void;
	removeTag: (name: string) => void;
	hasFrame: (name: string) => boolean;
	setFrame: (name: string) => void;
	removeFrame: (name: string) => void;
};

export type Package = {
	name: string;
	path: string;
	parentDirPath: Nullable<string>;
	parentPackagePath: Nullable<string>;
	hasParentPackage: boolean;
	subPackagePaths: string[];
	modulePaths: string[];
};

export type Frames = {
	getAll: () => string[];
	has: (name: string) => boolean;
	getModPaths: (name: string) => string[];
	getFrameInFramesMap: (name: string) => Map</* name */ string, ModuleDependencyItem[]>;
	getModPathInOtherFramesMap: (path: string) => Map</* name */ string, /* paths */ string[]>;
};

export type Modules = {
	getAll: () => Module[];
	find: (path: string) => Nullable<Module>;
	get: (path: string) => Module;
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
};

export type TagSample = {
	name: string;
	modules: Dict<Module>;
	modPaths: string[];
};

export type Tags = {
	all: string[];
	has: (name: string) => boolean;
	get: (name: string) => TagSample;
};

export type ExternalImportsSample = {
	imports: Dict<Import>;
	locators: Dict<Import[]>;
};

export type Imports = {
	all: Dict<Import>;
	local: Dict<Import>;
	external: ExternalImportsSample;
	fullResolved: Dict<Import>;
	fullUnresolved: Dict<Import>;
	localUnresolved: Dict<Import>;
	dynamic: Dict<Import>;
	static: Dict<Import>;
};

export type ImportDefectRulesSample = {
	rules: string[];
	get: (rule: string) => ImportDefect[];
	getModPaths: (rule: string) => string[];
};

export type ImportDefectModPathsSample = {
	modPaths: string[];
	get: (modPath: string) => ImportDefect[];
};

export type ImportDefects = {
	getAll: () => ImportDefect[];
	getAllRules: () => string[];
	sampleRules: () => ImportDefectRulesSample;
	sampleModPaths: () => ImportDefectModPathsSample;
	remove: (importId: string, rule: string) => void;
	removeByRule: (rule: string) => void;
	removeAll: () => void;
};

export type ModuleDefectRulesSample = {
	rules: string[];
	get: (rule: string) => ModuleDefect[];
};

export type ModuleDefectModPathsSample = {
	modPaths: string[];
	get: (modPath: string) => ModuleDefect[];
};

export type ModuleDefects = {
	getAll: () => ModuleDefect[];
	getAllRules: () => string[];
	sampleRules: () => ModuleDefectRulesSample;
	sampleModPaths: () => ModuleDefectModPathsSample;
	remove: (path: string, rule: string) => void;
	removeByRule: (rule: string) => void;
	removeAll: () => void;
};

export type AppContextEnv = {
	version: string;
	basePath: string;
	preset: ConfigPreset;
	htmlxComponents: HtmlxComponents;
	getShortPath: (path: string) => string;
	getFullPath: (path: string) => string;
	findFullPath: (path: string) => string | null;
	getEditorUrl: (path: string, line?: number) => string;
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
	getSummary: () => AppContextSummary;
};

export type TaskContextComponents = {
	moduleCode: (path: string, lineRange?: LineRange) => string;
	moduleLink: (path: string, lineRange?: LineRange) => string;
	lintResult: () => string;
	summary: () => string;
};

export type TaskContext = {
	tuix: Tuix;
	components: TaskContextComponents;
	appContext: AppContext;

	args: string[];

	writeReport: (report: Report) => Promise<void>;
};
