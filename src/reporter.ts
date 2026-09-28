import { stringify } from "@std/yaml";

import { remapErr } from "~/lib/err.ts";
import { writeFile } from "~/lib/file.ts";
import { tab } from "~/lib/text.ts";
import { assertNever } from "~/lib/ts.ts";
import type { Context, Report } from "~/api.ts";
import { getPageHtml } from "~/htmlx/index.ts";

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
				case "yaml":
					return stringify(data, { indent: 4, lineWidth: 120 });

				case "json":
					return JSON.stringify(data, null, tab);

				case "text":
					return data?.toString() ?? "";

				case "html":
					return await getPageHtml(data?.toString() ?? "");

				default:
					assertNever(format);
			}
		} catch (e) {
			throw remapErr(
				e,
				`An error occurred while preparing data for the reporter. Format - '${report.format}', path - '${report.path}'.`,
			);
		}
	}
}
