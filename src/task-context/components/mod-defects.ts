import { br } from "~/lib/text.ts";
import type { Mod } from "~/api.d.ts";
import { tuix } from "~/tuix/index.ts";

import { modCode } from "./mod-code.ts";

export function modDefects({ mod }: { mod: Mod }) {
	const defs = mod.defects.byRule
		.map(({ info }) => `rule (mod): ${info}`)
		.concat(mod.imps.byId
			.fold((acc, { defects, fileLineRange }) =>
				acc.merge(defects.byRule
					.mapE(({ id, info }) => {
						const content = tuix.lines([
							`rule (imp): ${info}`,
							modCode({ mod, lineRange: fileLineRange }),
						]);

						return [id, content];
					}))
			));

	return defs.size > 0 ? defs.join(br.repeat(2)) : "No defects";
}
