import { stringify } from "@std/yaml";
import { ensureFile } from "@std/fs";

import { remapErr } from "~/lib/err.ts";
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

		try {
			await ensureFile(report.path);
			await Deno.writeTextFile(report.path, content);
		} catch (e) {
			throw remapErr(e, `Can't write to the file '${report.path}'.`);
		}
	}

	async #getContent({ report, context }: { report: Report; context: Context }) {
		try {
			const data = await report.provide(context);
			const { format } = report;

			switch (format) {
				case "yaml":
					return stringify(data, { indent: 4, lineWidth: 120 });

				case "json":
					return JSON.stringify(data, null, "\t");

				case "text":
					return data?.toString() ?? "";

				case "html":
					return getPageHtml(data?.toString() ?? "");

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
