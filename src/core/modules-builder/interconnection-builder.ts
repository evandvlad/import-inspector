import { assert } from "~/lib/err.ts";

import type { Import } from "../import.ts";

type FileConnections = {
	links: string[];
	imports: Import[];
};

export class InterconnectionBuilder {
	#interconnectionMap = new Map<string, FileConnections>();

	connect({ path, imports }: { path: string; imports: Import[] }) {
		this.#interconnectionMap.set(path, {
			imports,
			links: [],
		});
	}

	build() {
		this.#fillLinks();

		return {
			getImports: (path: string) => {
				return this.#getConnections(path).imports;
			},

			getLinks: (path: string) => {
				return this.#getConnections(path).links;
			},
		};
	}

	#fillLinks() {
		this.#interconnectionMap.forEach(({ imports }, path) => {
			imports.forEach(({ resolution }) => {
				if (resolution?.path) {
					const { links } = this.#getConnections(resolution.path);

					if (!links.includes(path)) {
						links.push(path);
					}
				}
			});
		});
	}

	#getConnections(path: string) {
		const connections = this.#interconnectionMap.get(path);
		assert(connections, `Can't find the connections by the path '${path}'.`);
		return connections;
	}
}
