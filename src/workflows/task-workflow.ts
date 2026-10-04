import type { AppContext } from "~/api.ts";

import { assert } from "~/lib/err.ts";
import type { Settings } from "~/settings.ts";
import { TaskContext } from "~/task-context/index.ts";

export async function runTaskWorkflow(
	{ appContext, settings, taskName, taskArgs }: {
		appContext: AppContext;
		settings: Settings;
		taskName: string;
		taskArgs: string[];
	},
) {
	const taskHandler = settings.findTask(taskName);

	assert(taskHandler, `Can't find task '${taskName}.'.`);

	const taskContext = new TaskContext({
		appContext,
		settings,
		taskName,
		taskArgs,
	});

	return await taskHandler(taskContext);
}
