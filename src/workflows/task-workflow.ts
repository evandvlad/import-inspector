import { assert } from "~/lib/err.ts";
import type { AppContext } from "~/api.d.ts";
import type { Settings } from "~/settings.ts";
import { TaskContext } from "~/task-context/index.ts";

export async function runTaskWorkflow(
	{ appContext, settings, name, args }: {
		appContext: AppContext;
		settings: Settings;
		name: string;
		args: string[];
	},
) {
	const task = settings.tasks.getOrDefault(name, null);
	assert(task, `Can't find task '${name}'.`);

	const taskContext = new TaskContext({ appContext, settings, args });
	return await task.perform(taskContext);
}
