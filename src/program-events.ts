import { PubSub } from "~/lib/pub-sub.ts";
import type { Dict } from "~/lib/dict.ts";

type EventMap = {
	"launch-workflow:started": [];
	"launch-workflow.error-logger-creation:started": [];
	"launch-workflow.error-logger-creation:finished": [];
	"launch-workflow.command-execution:started": [name: string];
	"launch-workflow.command-execution:finished": [name: string];
	"launch-workflow:finished": [];
	"program-workflow:started": [];
	"program-workflow.config-loading:started": [];
	"program-workflow.config-loading:finished": [];
	"program-workflow.config-settings-loading:started": [preset: string];
	"program-workflow.config-settings-loading:finished": [preset: string];
	"program-workflow.worker:started": [];
	"program-workflow.worker:finished": [exitCode: number | void];
	"program-workflow:finished": [];
	"app-workflow:started": [];
	"app-workflow:finished": [];
	"app-workflow.files-collecting:started": [];
	"app-workflow.files-collecting:finished": [files: Dict<string>];
	"app-workflow.files-parsing:started": [];
	"app-workflow.file-parsing:started": [path: string];
	"app-workflow.file-parsing:finished": [path: string];
	"app-workflow.files-parsing:finished": [];
	"app-workflow.app-context-creation:started": [];
	"app-workflow.app-context-creation:finished": [];
	"app-workflow.tag-settings:started": [];
	"app-workflow.tag-settings:finished": [];
	"app-workflow.linting:started": [];
	"app-workflow.linting:finished": [];
	"task-workflow:started": [name: string];
	"task-workflow.task-context-creation:started": [];
	"task-workflow.task-context-creation:finished": [];
	"task-workflow.task-performing:started": [];
	"task-workflow.task-performing:finished": [];
	"task-workflow:finished": [name: string, exitCode: number | void];
};

export type EventName = keyof EventMap;

const { pub, sub } = new PubSub<EventMap>();

export { pub, sub };
