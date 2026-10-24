import type { Module } from "~/api.d.ts";
import { tuix } from "~/tuix/index.ts";

import { modCode } from "./mod-code.ts";

export function modDefects({ mod }: { mod: Module }) {
	return mod.defects.byRule
		.map(({ info }) => `Rule (module): ${info}`)
		.concat(mod.imps.byId
			.fold((acc, { defects, fileLineRange }) =>
				acc.merge(defects.byRule
					.mapE(({ id, info }) => {
						const content = tuix.lines([
							`Rule (import): ${info}`,
							modCode({ mod, lineRange: fileLineRange }),
						]);

						return [id, content];
					}))
			))
		.reduce((acc, item) => acc ? tuix.lines([acc, "", item]) : item, "");
}
