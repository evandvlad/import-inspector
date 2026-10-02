import { remapErr } from "~/lib/err.ts";
import { writeFile } from "~/lib/fs.ts";
import { tab } from "~/lib/text.ts";
import { assertNever } from "~/lib/ts.ts";
import type { Context, Report } from "~/api.ts";
import { createHtml } from "~/htmlx/index.ts";

export class Reporter {
	#reports;

	constructor({ reports }: { reports: Report[] }) {
		this.#reports = reports;
	}

	async write({ context }: { context: Context }) {
		await Promise.all(this.#reports.map((report) => this.#writeReport({ report, context })));
	}

	async #writeReport({ report, context }: { report: Report; context: Context }) {
		const content = await this.#getContent({ report, context });
		await writeFile(report.path, content);
	}

	async #getContent({ report, context }: { report: Report; context: Context }) {
		try {
			const data = await report.provide(context);
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
