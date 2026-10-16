import { isNull } from "~/lib/vtype.ts";
import type { Dict, Module_v1, Package_v1 } from "~/api.ts";

export class Package implements Package_v1 {
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
			modules: Dict<Module_v1>;
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
