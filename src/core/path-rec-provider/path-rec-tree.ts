import { basename, concat, split } from "~/lib/upath.ts";

import { DirPathRec } from "./dir-path-rec.ts";
import { FilePathRec } from "./file-path-rec.ts";

export type Node = {
	path: string;
	name: string;
	parent: Node | null;
	value: FilePathRec | DirPathRec;
	children: Map</* name */ string, Node>;
};

const nullDirPathRec = new DirPathRec({ basePath: "/", path: "/", childPaths: [] });

function extractChildPath({ path, descendantPath }: { path: string; descendantPath: string }) {
	const pathPartsLength = split(path).length;
	const descendantPathParts = split(descendantPath);

	return concat(descendantPathParts.slice(0, pathPartsLength + 1));
}

function createNode({ parent, path }: { parent: Node | null; path: string }): Node {
	return {
		path,
		parent,
		name: basename(path),
		value: nullDirPathRec,
		children: new Map(),
	};
}

function createBranch({ node, path }: { node: Node; path: string }) {
	if (node.path === path) {
		return node;
	}

	const childPath = extractChildPath({ path: node.path, descendantPath: path });
	const childName = basename(childPath);

	const childNode = node.children.getOrInsertComputed(
		childName,
		() => createNode({ parent: node, path: childPath }),
	);

	return createBranch({ path, node: childNode });
}

function updateNodeValue({ node, basePath }: { node: Node; basePath: string }) {
	const { path } = node;
	const isFilePath = node.children.size === 0;

	if (isFilePath) {
		node.value = new FilePathRec({ path });
		return;
	}

	if (node.value !== nullDirPathRec) {
		return;
	}

	if (basePath.length >= path.length) {
		return;
	}

	const childPaths = Array.from(node.children.values())
		.map(({ path }) => path);

	node.value = new DirPathRec({ basePath, path, childPaths });
}

function fillBranch({ node, basePath }: { node: Node; basePath: string }) {
	updateNodeValue({ node, basePath });

	if (node.parent) {
		fillBranch({ node: node.parent, basePath });
	}
}

function extractScopeRoot({ root, basePath }: { root: Node; basePath: string }) {
	let node = root;

	for (const part of split(basePath).slice(1)) {
		node = node.children.get(part)!;
	}

	node.children.forEach((node) => {
		node.parent = null;
	});

	return node;
}

export function createPathRecTree({ basePath, filePaths }: { basePath: string; filePaths: string[] }) {
	const path = split(filePaths.at(0)!).at(0)!;
	const root = createNode({ parent: null, path });

	filePaths
		.map((path) => createBranch({ path, node: root }))
		.forEach((node) => {
			fillBranch({ basePath, node });
		});

	return extractScopeRoot({ root, basePath });
}
