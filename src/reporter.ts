import { remapErr } from "~/lib/err.ts";
import { writeFile } from "~/lib/fs.ts";
import { tab } from "~/lib/text.ts";
import { assertNever } from "~/lib/ts.ts";
import type { AppContext, Report } from "~/api.ts";
import { createHtml } from "~/htmlx/index.ts";

export class Reporter {
	#reports;

	constructor({ reports }: { reports: Report[] }) {
		this.#reports = reports;
	}

	async write({ appContext }: { appContext: AppContext }) {
		await Promise.all(this.#reports.map((report) => this.#writeReport({ report, appContext })));
	}

	async #writeReport({ report, appContext }: { report: Report; appContext: AppContext }) {
		const content = await this.#getContent({ report, appContext });
		await writeFile(report.path, content);
	}

	async #getContent({ report, appContext }: { report: Report; appContext: AppContext }) {
		try {
			const data = await report.provide(appContext);
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
