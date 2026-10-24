type Rec<T> = Record<string, T>;
type Entry<T> = [key: string, value: T];
type Nullable<T> = T | null;
type MaybePromise<T> = T | Promise<T>;
type Collection<T> = Dict<T> | Rec<T> | Map<string, T> | Array<Entry<T>>;
type DictReducer<T, U = T> = (acc: U, value: T, key: string) => U;

export interface Dict<T> {
	size: number;
	has: (key: string) => boolean;
	set: (key: string, value: T) => this;
	remove: (key: string) => this;
	clear: () => this;
	get: (key: string) => T;
	getOrDefault: <U = undefined>(key: string, defaultValue: U) => T | U;
	getOrInsert: (key: string, value: T) => T;
	getOrInsertComputed: (key: string, compute: () => T) => T;
	addOrReduce: (key: string, value: T, reducer: DictReducer<T>) => this;
	find: (callback: (value: T, key: string) => unknown) => T | undefined;
	findK: (callback: (value: T, key: string) => unknown) => string | undefined;
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
	contains: (value: T) => boolean;
	every: (callback: (value: T, key: string) => unknown) => boolean;
	sortK: (callback?: (key1: string, key2: string) => number) => Dict<T>;
	sortE: (callback: (entry1: Entry<T>, entry2: Entry<T>) => number) => Dict<T>;
	reduce: <U>(callback: DictReducer<T, U>, init: U) => U;
	fold: <U>(callback: DictReducer<T, Dict<U>>) => Dict<U>;
	group: (callback: (value: T, key: string) => string) => Dict<Dict<T>>;
	merge: (collection: Collection<T>, reducer?: DictReducer<T>) => this;
	concat: (collection: Collection<T>, reducer?: DictReducer<T>) => Dict<T>;
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

export type Lang = "ts" | "js";

export type Span = {
	start: number;
	end: number;
};

export type LineRange = [line: number] | [startLine: number, endLine: number];

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
	prompt: (options?: { label?: string; value?: string }) => string;
	confirm: (message: string) => boolean;
	select: <T extends string = string>(items: TuixSelectItem<T>[], options?: { label?: string }) => TuixSelectItem<T>;
	clear: () => void;
	print: (value: string | string[]) => void;
	eprint: (value: string | string[], options?: { noColor?: boolean }) => void;
	printData: (data: unknown) => void;
	withSpin: <T>(message: string, fn: (stop: () => void) => Promise<T>) => Promise<T>;
};

export type RootEntry = {
	// Absolute path
	path: string;
	alias?: string;
};

export type Report = {
	// Absolute path
	path: string;
	provide: (appContext: AppContext) => MaybePromise<string>;
};

export type ConfigPresetData = {
	// Absolute path
	settingsPath: string;
	// Absolute path
	projectPath: string;
};

export type ConfigPreset = ConfigPresetData & {
	name: string;
};

export type Config = {
	presets: Rec</* name */ ConfigPresetData>;
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
	// Returns an array of import locators
) => Promise<string[]>;

export type PreLint = (appContext: AppContext) => MaybePromise<void>;
export type PostLint = (appContext: AppContext) => MaybePromise<void>;

export type Task = {
	name: string;
	description: string;
	perform: (taskContext: TaskContext) => MaybePromise</* exit code */ number | void>;
};

export type Settings = {
	rootEntries: RootEntry[];
	importRemaps?: Rec<string>;
	correctUnresolvedDynamicImports?: CorrectUnresolvedDynamicImports;
	preLint?: PreLint;
	postLint?: PostLint;
	reports?: Report[];
	tasks?: Task[];
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

export type ImportDefect = {
	id: string;
	rule: string;
	info: string;
	description: string;
	imp: Import;
	mod: Module;
	defects: Defects<ImportDefect>;
};

export type ModuleDefect = {
	id: string;
	rule: string;
	info: string;
	description: string;
	mod: Module;
	defects: Defects<ModuleDefect>;
};

export type Defect = ModuleDefect | ImportDefect;

export interface Defects<T extends Defect> {
	size: number;
	rules: string[];
	byRule: Dict<T>;
	has: (rule: string) => boolean;
	get: (rule: string) => T;
	find: (rule: string) => Nullable<T>;
	add: (rule: string, description?: string) => this;
	remove: (rule: string) => this;
	removeAll: () => this;
}

export type ImportResolution = {
	mod: Nullable<Module>;
	isExternal: boolean;
	isRelative: boolean;
};

export type Import = {
	id: string;
	locator: Nullable<string>;
	location: Nullable<string>;
	isDynamic: boolean;
	resolution: Nullable<ImportResolution>;
	sourceMod: Module;
	importedMod: Nullable<Module>;
	fileLineRange: LineRange;
	fileEntries: FileEntry[];
	defects: Defects<ImportDefect>;
};

export type Imports = {
	size: number;
	ids: string[];
	byId: Dict<Import>;
	localById: Dict<Import>;
	fullResolvedById: Dict<Import>;
	fullUnresolvedById: Dict<Import>;
	localUnresolvedById: Dict<Import>;
	localUnresolvedByLocator: Dict<Dict<Import>>;
	dynamicById: Dict<Import>;
	staticById: Dict<Import>;
	externalById: Dict<Import>;
	externalByLocator: Dict<Dict<Import>>;
	has: (id: string) => boolean;
	get: (id: string) => Import;
	find: (id: string) => Nullable<Import>;
	hasForMod: (mod: Module) => boolean;
	getForMod: (mod: Module) => Dict<Import>;
	findForMod: (mod: Module) => Nullable<Import>;
};

export interface ModuleTrait {
	size: number;
	names: string[];
	has: (name: string) => boolean;
	add: (name: string) => this;
	remove: (name: string) => this;
}

export type Module = {
	name: string;
	lang: Lang;
	path: string;
	shortPath: string;
	tags: ModuleTrait;
	frames: ModuleTrait;
	file: File;
	pack: Nullable<Package>;
	isInPack: boolean;
	isPackEntry: boolean;
	links: Dict<Module>;
	imps: Imports;
	defects: Defects<ModuleDefect>;
};

export type Package = {
	name: string;
	path: string;
	shortPath: string;
	parent: Nullable<Package>;
	hasParent: boolean;
	children: Dict<Package>;
	ancestry: Dict<Package>;
	mods: Dict<Module>;
};

export interface AppContextPackages {
	all: Dict<Package>;
	roots: Dict<Package>;
}

export type AppContextTags = {
	size: number;
	names: string[];
	mods: Dict<Dict<Module>>;
	has: (name: string) => boolean;
};

export type AppContextFrame = {
	name: string;
	mods: Dict<Module>;
	links: Dict<Module>;
	impsByLink: Dict<Dict<Import>>;
	impsByMod: Dict<Dict<Import>>;
	modsByInFrame: Dict<Dict<Module>>;
	modsByOutFrame: Dict<Dict<Module>>;
};

export type AppContextFrames = {
	size: number;
	names: string[];
	byName: Dict<AppContextFrame>;
	has: (name: string) => boolean;
	get: (path: string) => AppContextFrame;
	find: (path: string) => Nullable<AppContextFrame>;
};

export interface AppContextDefects<T extends Defect> {
	size: number;
	ids: string[];
	rules: string[];
	paths: string[];
	byId: Dict<T>;
	byRule: Dict<Dict<T>>;
	byPath: Dict<Dict<T>>;
	removeByRule: (rule: string) => this;
	removeById: (id: string) => this;
	removeAll: () => this;
}

export type AppContextSummary = {
	tags: number;
	frames: number;
	packs: number;
	mods: number;
	imps: number;
	impDefects: number;
	modDefects: number;
	totalDefects: number;
};

export type AppContextEnv = {
	version: string;
	basePath: string;
	preset: ConfigPreset;
	htmlxc: Htmlxc;
	toShortPath: (pathOrShortPath: string) => string;
	toFullPath: (pathOrShortPath: string) => string;
	editorUrl: (path: string, line?: number) => string;
};

export type AppContext = {
	env: AppContextEnv;
	mods: Dict<Module>;
	imps: Imports;
	packs: AppContextPackages;
	tags: AppContextTags;
	frames: AppContextFrames;
	summary: AppContextSummary;
	impDefects: AppContextDefects<ImportDefect>;
	modDefects: AppContextDefects<ModuleDefect>;
};

export type TaskContextComponents = {
	modPathLink: (mod: Module, lineRange?: LineRange) => string;
	modCode: (mod: Module, lineRange?: LineRange) => string;
	modLinks: (mod: Module) => string;
	lintResult: () => string;
	summary: () => string;
};

export type TaskContext = {
	tuix: Tuix;
	components: TaskContextComponents;
	appContext: AppContext;

	args: string[];

	report: (report: Report) => Promise<void>;
	exit: (isError?: boolean) => never;
};
