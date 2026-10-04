import type { AppContext, TaskContext as ITaskContext } from "~/api.ts";
import type { Settings } from "~/settings.ts";
import * as clix from "~/clix/index.ts";

import { Components } from "./components/index.ts";

export class TaskContext implements ITaskContext {
	clix;
	appContext;
	components;

	taskName;
	taskArgs;

	constructor(
		{ appContext, settings, taskName, taskArgs = [] }: {
			appContext: AppContext;
			settings: Settings;
			taskName?: string;
			taskArgs?: string[];
		},
	) {
		this.clix = clix;
		this.appContext = appContext;
		this.components = new Components({ appContext, settings });

		this.taskName = taskName;
		this.taskArgs = taskArgs;
	}
}
