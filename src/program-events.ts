import { PubSub } from "~/lib/pub-sub.ts";
import type { Dict } from "~/lib/dict.ts";

const { pub, sub } = new PubSub<{
	"program-workflow:started": [];
	"program-workflow:config-loading:started": [];
	"program-workflow:config-loading:finished": [];
	"program-workflow:config-settings-loading:started": [preset: string];
	"program-workflow:config-settings-loading:finished": [preset: string];
	"program-workflow:worker:started": [];
	"program-workflow:worker:finished": [exitCode: number | void];
	"program-workflow:finished": [];
	"app-workflow:started": [];
	"app-workflow:finished": [];
	"app-workflow:files-collecting:started": [];
	"app-workflow:files-collecting:finished": [files: Dict<string>];
	"app-workflow:files-parsing:started": [];
	"app-workflow:file-parsing:started": [path: string];
	"app-workflow:file-parsing:finished": [path: string];
	"app-workflow:files-parsing:finished": [];
	"app-workflow:app-context-creation:started": [];
	"app-workflow:app-context-creation:finished": [];
	"app-workflow:tag-settings:started": [];
	"app-workflow:tag-settings:finished": [];
	"app-workflow:linting:started": [];
	"app-workflow:linting:finished": [];
}>();

export { pub, sub };
