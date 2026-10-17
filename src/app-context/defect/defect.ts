export abstract class Defect {
	id;
	rule;
	info;
	description;

	constructor({ rule, description = "" }: { rule: string; description?: string }) {
		this.id = crypto.randomUUID() as string;
		this.rule = rule;
		this.description = description;

		this.info = `${rule}${description ? ` (${description})` : ""}`;
	}
}
