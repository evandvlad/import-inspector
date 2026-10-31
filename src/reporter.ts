import { remapErr } from "~/lib/err.ts";
import { writeFile } from "~/lib/fs.ts";
import type { AppContext, Report } from "~/api.d.ts";
import { createHtml } from "~/htmlx/index.ts";
import { pub } from "~/program-events.ts";

export class Reporter {
	#appContext;

	constructor({ appContext }: { appContext: AppContext }) {
		this.#appContext = appContext;
	}

	async write(report: Report) {
		pub.send("reporter:started", report.path);

		const content = await this.#getContent(report);
		await writeFile(report.path, content);

		pub.send("reporter:finished", report.path);
	}

	async #getContent(report: Report) {
		try {
			const data = await report.provide(this.#appContext);
			return await createHtml(data?.toString() ?? "");
		} catch (e) {
			throw remapErr(
				e,
				`Failed to generate report '${report.path}'.`,
			);
		}
	}
}
