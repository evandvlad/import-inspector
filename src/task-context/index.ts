import type { AppContext, Report, TaskContext as ITaskContext } from "~/api.ts";
import type { Settings } from "~/settings.ts";
import * as clix from "~/clix/index.ts";
import { Reporter } from "~/reporter.ts";

import { Components } from "./components/index.ts";

export class TaskContext implements ITaskContext {
	clix;
	appContext;
	components;

	args;

	#reporter;

	constructor(
		{ appContext, settings, args = [] }: {
			appContext: AppContext;
			settings: Settings;
			args?: string[];
		},
	) {
		this.clix = clix;
		this.appContext = appContext;
		this.components = new Components({ appContext, settings });

		this.args = args;

		this.#reporter = new Reporter({ appContext });
	}

	writeReport = (report: Report) => {
		return this.#reporter.write(report);
	};
}
