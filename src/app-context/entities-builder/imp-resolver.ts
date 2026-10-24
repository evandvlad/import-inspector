import { dirname, join } from "~/lib/upath.ts";
import type { Nullable } from "~/lib/ts.ts";
import type { Settings } from "~/settings.ts";
import { getImportPathSuffixCandidates } from "~/project-specifics.ts";
import type { ImpRec, ImpResolutionData } from "~/values.ts";

import type { PathRecProvider } from "./path-rec-provider/index.ts";

type Alias = {
	value: string;
	path: string;
	strict: boolean;
};

export class ImpResolver {
	#aliases;
	#pathRecProvider;
	#pathSuffixCandidates;

	constructor({ settings, pathRecProvider }: { settings: Settings; pathRecProvider: PathRecProvider }) {
		this.#pathRecProvider = pathRecProvider;
		this.#pathSuffixCandidates = getImportPathSuffixCandidates();

		this.#aliases = this.#createAliases(settings);
	}

	resolve({ path, impRec }: { path: string; impRec: ImpRec }): Nullable<ImpResolutionData> {
		return impRec.locator ? this.#resolve({ path, impRec }) : null;
	}

	#createAliases({ rootEntries, importRemaps }: Settings) {
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

	#resolve({ path, impRec }: { path: string; impRec: ImpRec }) {
		const locator = impRec.locator!;
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
			path: this.#findPath(join(dirname(path), locator)),
		};
	}

	#findPathLocator(locator: string) {
		return Iterator.from(this.#aliases)
			.filter(({ value, strict }) => strict ? locator === value : locator.startsWith(value))
			.map(({ value, path, strict }) => strict ? path : join(path, locator.slice(value.length)))
			.find(Boolean) ?? null;
	}

	#findPath(modLocator: string) {
		return Iterator.from(this.#pathSuffixCandidates)
			.map((suffixCandidate) => [modLocator, suffixCandidate].join(""))
			.map((modPath) => this.#pathRecProvider.findFilePathRec(modPath)?.path)
			.find(Boolean) ?? null;
	}
}
