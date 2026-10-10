import { isNull } from "~/lib/vtype.ts";
import type { Dict, Module, Package as IPackage } from "~/api.ts";

export class Package implements IPackage {
	name;
	path;
	modules;
	children;
	parent;

	hasParent;

	constructor(
		{ name, path, modules, children, parent }: {
			name: string;
			path: string;
			modules: Dict<Module>;
			children: string[];
			parent: string | null;
		},
	) {
		this.name = name;
		this.path = path;
		this.modules = modules;
		this.children = children;
		this.parent = parent;
		this.hasParent = !isNull(parent);
	}
}
