import { assert } from "~/lib/err.ts";
import type { AppContext } from "~/api.d.ts";
import type { Settings } from "~/settings.ts";
import { TaskContext } from "~/task-context/index.ts";
import { pub } from "~/program-events.ts";

export async function runTaskWorkflow(
	{ appContext, settings, name, args }: {
		appContext: AppContext;
		settings: Settings;
		name: string;
		args: string[];
	},
) {
	pub.send("task-workflow:started", name);

	const task = settings.tasks.getOrDefault(name, null);
	assert(task, `Can't find task '${name}'.`);

	pub.send("task-workflow.task-context-creation:started");
	const taskContext = new TaskContext({ appContext, settings, args });
	pub.send("task-workflow.task-context-creation:finished");

	pub.send("task-workflow.task-performing:started");
	const exitCode = await task.perform(taskContext);
	pub.send("task-workflow.task-performing:finished");

	pub.send("task-workflow:finished", name, exitCode);

	return exitCode;
}
