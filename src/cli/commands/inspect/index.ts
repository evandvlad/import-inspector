import { run } from "~/core/index.ts";

import { Presenter } from "./presenter.ts";

export async function runInspectCommand() {
	const presenter = new Presenter();

	const { config, context } = await run();

	presenter.summarize({ context, config });
}
