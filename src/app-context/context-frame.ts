import { Dict } from "~/lib/dict.ts";
import type { AppContextFrame, Dict as IDict, Import, Module } from "~/api.d.ts";

import { cache } from "./tag-based-cache.ts";

export class ContextFrame implements AppContextFrame {
	name;

	#modDict;

	constructor({ name, modDict }: { name: string; modDict: IDict<Module> }) {
		this.name = name;
		this.#modDict = modDict;
	}

	@cache("frames")
	get mods() {
		return this.#modDict.filter((mod) => this.#isModInFrame(mod));
	}

	@cache("frames")
	get links() {
		return this.mods.fold<Module>((acc, mod) => acc.merge(mod.links.filter((link) => !this.#isModInFrame(link))));
	}

	@cache("frames")
	get impsByLink() {
		return this.links.map(({ imps }) =>
			imps.fullResolvedById.filter(({ importedMod }) => this.#isModInFrame(importedMod!))
		);
	}

	@cache("frames")
	get impsByMod() {
		return this.mods.fold<IDict<Import>>((acc, mod) =>
			acc.set(
				mod.path,
				mod.links.fold<Import>((impsAcc, link) =>
					this.#isModInFrame(link) ? impsAcc : impsAcc.merge(link.imps.getForMod(mod))
				),
			)
		);
	}

	@cache("frames")
	get modsByInFrame() {
		return this.mods.fold<IDict<Module>>((acc, { imps }) =>
			imps.fullResolvedById.reduce((acc, { importedMod }) => {
				const impMod = importedMod!;

				if (this.#isModInFrame(impMod)) {
					return acc;
				}

				impMod.frames.names.forEach((name) => {
					acc.getOrInsertComputed(name, () => Dict.empty<Module>())
						.set(impMod.path, impMod);
				});

				return acc;
			}, acc)
		);
	}

	@cache("frames")
	get modsByOutFrame() {
		return this.links.fold<IDict<Module>>((acc, link) => {
			if (this.#isModInFrame(link)) {
				return acc;
			}

			link.frames.names.forEach((name) => {
				acc.getOrInsertComputed(name, () => Dict.empty<Module>())
					.set(link.path, link);
			});

			return acc;
		});
	}

	#isModInFrame(mod: Module) {
		return mod.frames.has(this.name);
	}
}
