import { parse } from "~/lib/upath.ts";

import type { FileExtInfo } from "./values.ts";

export const fileExtNames = [".js", ".ts", ".tsx"] as const;

export type FileExtName = typeof fileExtNames[number];

const fileExtInfoMap: Record<FileExtName, FileExtInfo> = {
	".js": {
		lang: "js",
		canUseReactSyntax: true,
		canBeDeclaration: false,
		importResolutionOrder: 3,
	},
	".ts": {
		lang: "ts",
		canUseReactSyntax: false,
		canBeDeclaration: true,
		importResolutionOrder: 1,
	},
	".tsx": {
		lang: "ts",
		canUseReactSyntax: true,
		canBeDeclaration: false,
		importResolutionOrder: 2,
	},
};

export const orderedPackageEntryPointNames = ["index", "index.d", "index.entry"];

export function getImportPathSuffixCandidates() {
	const extNames = Object.entries(fileExtInfoMap)
		.toSorted(([_1, info1], [_2, info2]) => info1.importResolutionOrder - info2.importResolutionOrder)
		.map(([extName]) => extName as FileExtName);

	const declarationSuffixes = extNames
		.filter((extName) => getFileExtInfo(extName).canBeDeclaration)
		.map((extName) => [".d", extName].join(""));

	const fileSuffixes = [extNames, declarationSuffixes].flat();

	return [
		fileSuffixes,
		fileSuffixes.map((suffix) => ["/index", suffix].join("")),
	].flat();
}

export function getFileExtInfo(fileExtName: FileExtName) {
	return fileExtInfoMap[fileExtName];
}

export function isEntryPointFile(path: string) {
	const { name } = parse(path);
	return name.endsWith(".entry");
}

export function isTestFile(path: string) {
	const { name } = parse(path);
	return name.endsWith(".test");
}

export function isIndependentFile(path: string) {
	return isEntryPointFile(path) || isTestFile(path);
}

export function isDeclarationFile(path: string) {
	const { name, ext } = parse(path);
	const extInfo = getFileExtInfo(ext as FileExtName);

	return name.endsWith(".d") && extInfo.canBeDeclaration;
}
