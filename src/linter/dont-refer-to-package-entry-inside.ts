import { ImportLintRule } from "~/api.ts";
import type { LintFunction } from "~/values.ts";

export const dontReferToPackageEntryInside: LintFunction = ({ imports, modules, packages }) => {
	imports.fullResolved
		.values()
		.filter((imp) => {
			const importedModule = modules.get(imp.resolved!);

			// Only inspect package entry points
			if (!(importedModule.isInPack && importedModule.isPackEntry)) {
				return false;
			}

			const sourceModule = modules.get(imp.source);

			if (!sourceModule.isInPack) {
				return false;
			}

			return sourceModule.pack === importedModule.pack ||
				packages.ancestry(sourceModule.pack!).has(importedModule.pack!);
		}).forEach((imp) => {
			imp.addDefect(ImportLintRule.DontReferToPackageEntryInside);
		});
};
