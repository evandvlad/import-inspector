import { remapErr } from "~/lib/err.ts";
import { writeFile } from "~/lib/fs.ts";
import { tab } from "~/lib/text.ts";
import { assertNever } from "~/lib/ts.ts";
import type { AppContext, Report } from "~/api.ts";
import { createHtml } from "~/htmlx/index.ts";

export class Reporter {
	#appContext;

	constructor({ appContext }: { appContext: AppContext }) {
		this.#appContext = appContext;
	}

	async write(report: Report) {
		const content = await this.#getContent(report);
		await writeFile(report.path, content);
	}

	async #getContent(report: Report) {
		try {
			const data = await report.provide(this.#appContext);
			const { format } = report;

			switch (format) {
				case "json":
					return JSON.stringify(data, null, tab);

				case "text":
					return data?.toString() ?? "";

				case "html":
					return await createHtml(data?.toString() ?? "");

				default:
					assertNever(format);
			}
		} catch (e) {
			throw remapErr(
				e,
				`Error occurred while preparing data for reporter. Format - '${report.format}', path - '${report.path}'.`,
			);
		}
	}
}
