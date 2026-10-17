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
	getOrDefault: <U = undefined>(key: string, defaultValue: U) => T | U;
	getOrInsert: (key: string, value: T) => T;
	addOrReduce: (key: string, value: T, reducer: (cur: T, value: T, key: string) => T) => this;
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
	fold: <U>(callback: (acc: Dict<U>, value: T, key: string) => Dict<U>) => Dict<U>;
	group: (callback: (value: T, key: string) => string) => Dict<T[]>;
	merge: (
		collection: Dict<T> | Rec<T> | Map<string, T> | Array<Entry<T>>,
		reducer?: (acc: T, value: T, key: string) => T,
	) => this;
	concat: (
		collection: Dict<T> | Rec<T> | Map<string, T> | Array<Entry<T>>,
		reducer?: (acc: T, value: T, key: string) => T,
	) => Dict<T>;
	keys: () => MapIterator<string>;
	values: () => MapIterator<T>;
	entries: () => MapIterator<Entry<T>>;
	toArray: () => T[];
	toEntries: () => Array<Entry<T>>;
	toKeys: () => string[];
	toMap: () => Map<string, T>;
	toRec: () => Rec<T>;
	toJSON: () => Rec<T>;
}

export type ReadonlyDict<T> = Pick<
	Dict<T>,
	| "size"
	| "has"
	| "get"
	| "getOrDefault"
	| "find"
	| "findE"
	| "forEach"
	| "filter"
	| "pick"
	| "omit"
	| "map"
	| "mapK"
	| "mapE"
	| "slice"
	| "some"
	| "every"
	| "sortK"
	| "sortE"
	| "reduce"
	| "fold"
	| "group"
	| "concat"
	| "keys"
	| "values"
	| "entries"
	| "toArray"
	| "toEntries"
	| "toKeys"
	| "toMap"
	| "toRec"
	| "toJSON"
>;

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

export type HtmlxcBaseOptions = {
	classes?: string[];
	attrs?: Rec<string>;
	styles?: Rec<string>;
};

export type HtmlxcTreeItem = {
	value: string;
	opened?: boolean;
	children?: HtmlxcTreeItem[];
};

export type Htmlxc = {
	h: (value: string, options?: { level?: 1 | 2 | 3 } & HtmlxcBaseOptions) => string;
	elem: (value: string, options?: HtmlxcBaseOptions) => string;
	flex: (items: string[], options?: { dir?: "v" | "h" } & HtmlxcBaseOptions) => string;
	cols: (items: string[], options?: HtmlxcBaseOptions) => string;
	link: (params: { url: string; value: string }, options?: HtmlxcBaseOptions) => string;
	flist: (items: Array<{ value: string; content: string }>, options?: HtmlxcBaseOptions) => string;
	mark: (value: string, options?: HtmlxcBaseOptions) => string;
	details: (
		params: { label: string; value: string },
		options?: { theme?: "standard" | "light" | "dark" } & HtmlxcBaseOptions,
	) => string;
	table: (rows: string[][], options?: HtmlxcBaseOptions) => string;
	expander: (params: { label: string; value: string }, options?: HtmlxcBaseOptions) => string;
	tabs: (items: Array<{ label: string; value: string }>, options?: HtmlxcBaseOptions) => string;
	tree: (items: HtmlxcTreeItem[], options?: { subtree?: boolean } & HtmlxcBaseOptions) => string;
	code: (entries: Array<{ line: number; value: string }>, options?: HtmlxcBaseOptions) => string;
	data: (value: unknown, options?: HtmlxcBaseOptions) => string;
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
	source: string;
	posSpan: Span;
	file: File;
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

export type FileEntry = {
	line: number;
	posSpan: Span;
	value: string;
};

export type File = {
	value: string;
	entries: FileEntry[];
	getLineRange: (span: Span) => LineRange;
	getContentBySpan: (span: Span) => string;
	getEntriesBySpan: (span: Span) => FileEntry[];
	getContentByLineRange: (lineRange: LineRange) => string;
	getEntriesByLineRange: (lineRange: LineRange) => FileEntry[];
};

export type AppContext = {
	v2: AppContext_v2;
};

export type TaskContextComponents = {
	moduleCode: (mod: Module_v2, lineRange?: LineRange) => string;
	moduleLink: (mod: Module_v2, lineRange?: LineRange) => string;
	lintResult: () => string;
	summary: () => string;
};

export type TaskContext = {
	tuix: Tuix;
	components: TaskContextComponents;
	appContext: AppContext;

	args: string[];

	report: (report: Report) => Promise<void>;
};

/// app-context API v2

export type ImportDefect_v2 = {
	id: string;
	rule: string;
	info: string;
	description: string;
	imp: Import_v2;
	mod: Module_v2;
};

export type ModuleDefect_v2 = {
	id: string;
	rule: string;
	info: string;
	description: string;
	mod: Module_v2;
};

export interface Defects_v2<T extends ModuleDefect_v2 | ImportDefect_v2> {
	total: number;
	rules: string[];
	byRule: ReadonlyDict<T>;
	has: (rule: string) => boolean;
	get: (rule: string) => T;
	find: (rule: string) => T | null;
	add: (rule: string, description?: string) => this;
	remove: (rule: string) => this;
	removeAll: () => this;
}

export type ImportResolution_v2 = {
	mod: Nullable<Module_v2>;
	isExternal: boolean;
	isRelative: boolean;
};

export type Import_v2 = {
	id: string;
	locator: Nullable<string>;
	location: Nullable<string>;
	isDynamic: boolean;
	resolution: Nullable<ImportResolution_v2>;
	sourceMod: Module_v2;
	fileLineRange: LineRange;
	fileEntries: FileEntry[];
	defects: Defects_v2<ImportDefect_v2>;
};

export type Imports_v2 = {
	total: number;
	ids: string[];
	has: (id: string) => boolean;
	get: (id: string) => Import_v2;
	find: (id: string) => Import_v2 | null;
	byId: ReadonlyDict<Import_v2>;
	localById: ReadonlyDict<Import_v2>;
	fullResolvedById: ReadonlyDict<Import_v2>;
	fullUnresolvedById: ReadonlyDict<Import_v2>;
	localUnresolvedById: ReadonlyDict<Import_v2>;
	dynamicById: ReadonlyDict<Import_v2>;
	staticById: ReadonlyDict<Import_v2>;
	externalById: ReadonlyDict<Import_v2>;
	externalByLocator: ReadonlyDict<Import_v2[]>;
};

export interface ModuleTrait_v2 {
	total: number;
	names: string[];
	has: (name: string) => boolean;
	add: (name: string) => this;
	remove: (name: string) => this;
}

export type PathableEntities_v2<T extends Module_v2 | Package_v2> = {
	total: number;
	paths: string[];
	has: (path: string) => boolean;
	get: (path: string) => T;
	find: (path: string) => T | null;
	byPath: ReadonlyDict<T>;
};

export type Module_v2 = {
	name: string;
	lang: Lang;
	path: string;
	shortPath: string;
	tags: ModuleTrait_v2;
	frames: ModuleTrait_v2;
	file: File;
	pack: Nullable<Package_v2>;
	isInPack: boolean;
	isPackEntry: boolean;
	links: PathableEntities_v2<Module_v2>;
	imps: Imports_v2;
	defects: Defects_v2<ModuleDefect_v2>;
};

export type Package_v2 = {
	name: string;
	path: string;
	shortPath: string;
	parent: Nullable<Package_v2>;
	hasParent: boolean;
	children: PathableEntities_v2<Package_v2>;
	ancestry: PathableEntities_v2<Package_v2>;
	mods: PathableEntities_v2<Module_v2>;
};

export interface AppContextPackages_v2 extends PathableEntities_v2<Package_v2> {
	roots: PathableEntities_v2<Package_v2>;
}

export type AppContextTags_v2 = {
	total: number;
	names: string[];
	modBy: ReadonlyDict<PathableEntities_v2<Module_v2>>;
	has: (name: string) => boolean;
};

export type AppContextFrames_v2 = {
	total: number;
	names: string[];
	modBy: ReadonlyDict<PathableEntities_v2<Module_v2>>;
	has: (name: string) => boolean;
};

export interface AppContextDefects_v2<T extends ImportDefect_v2 | ModuleDefect_v2> {
	total: number;
	ids: string[];
	rules: string[];
	paths: string[];
	byId: ReadonlyDict<T>;
	byRule: ReadonlyDict<T[]>;
	byPath: ReadonlyDict<T[]>;
	removeByRule: (rule: string) => this;
	removeById: (id: string) => this;
	removeAll: () => this;
}

export type AppContextSummary_v2 = {
	tags: number;
	frames: number;
	packs: number;
	mods: number;
	imps: number;
	impDefects: number;
	modDefects: number;
	totalDefects: number;
};

export type AppContextEnv_v2 = {
	version: string;
	basePath: string;
	preset: ConfigPreset;
	htmlxc: Htmlxc;
	toShortPath: (pathOrShortPath: string) => string;
	toFullPath: (pathOrShortPath: string) => string;
	editorUrl: (path: string, line?: number) => string;
};

export type AppContext_v2 = {
	env: AppContextEnv_v2;
	mods: PathableEntities_v2<Module_v2>;
	imps: Imports_v2;
	packs: AppContextPackages_v2;
	tags: AppContextTags_v2;
	frames: AppContextFrames_v2;
	summary: AppContextSummary_v2;
	impDefects: AppContextDefects_v2<ImportDefect_v2>;
	modDefects: AppContextDefects_v2<ModuleDefect_v2>;
};
