import { dirname, join } from "~/lib/upath.ts";

import type { ImportRec, ImportResolution } from "../values.ts";
import type { PathRecProvider } from "../path-rec-provider/index.ts";
import type { Config } from "../config.ts";
import { getImportPathSuffixCandidates } from "../project-specifics.ts";

type Alias = {
	value: string;
	path: string;
	strict: boolean;
};

export class ImportResolver {
	#aliases;
	#pathRecProvider;
	#pathSuffixCandidates;

	constructor({ config, pathRecProvider }: { config: Config; pathRecProvider: PathRecProvider }) {
		this.#pathRecProvider = pathRecProvider;
		this.#pathSuffixCandidates = getImportPathSuffixCandidates();

		this.#aliases = this.#createAliases(config);
	}

	resolve(importRec: ImportRec): ImportResolution | null {
		return importRec.locator ? this.#resolve(importRec) : null;
	}

	#createAliases({ rootEntries, importRemaps }: Config) {
		const aliases: Alias[] = [];

		Object.entries(importRemaps).forEach(([value, path]) => {
			aliases.push({ value, path, strict: true });
		});

		rootEntries.forEach(({ path, alias }) => {
			if (alias) {
				aliases.push({ value: alias, path, strict: false });
			}
		});

		return aliases;
	}

	#resolve(rec: ImportRec) {
		const locator = rec.locator!;
		const isRelative = locator.startsWith(".");

		if (!isRelative) {
			const pathLocator = this.#findPathLocator(locator);

			return {
				isRelative,
				isExternal: !pathLocator,
				path: pathLocator ? this.#findPath(pathLocator) : null,
			};
		}

		return {
			isRelative,
			isExternal: false,
			path: this.#findPath(join(dirname(rec.filePathRec.path), locator)),
		};
	}

	#findPathLocator(locator: string) {
		return Iterator.from(this.#aliases)
			.filter(({ value, strict }) => strict ? locator === value : locator.startsWith(value))
			.map(({ value, path, strict }) => strict ? path : join(path, locator.slice(value.length)))
			.find(Boolean) ?? null;
	}

	#findPath(moduleLocator: string) {
		return Iterator.from(this.#pathSuffixCandidates)
			.map((suffixCandidate) => [moduleLocator, suffixCandidate].join(""))
			.map((modulePath) => this.#pathRecProvider.findFilePathRec(modulePath)?.path)
			.find(Boolean) ?? null;
	}
}
