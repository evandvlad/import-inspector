import { runLaunchWorkflow } from "~/workflows/launch-workflow.ts";

await runLaunchWorkflow({ args: Deno.args });
