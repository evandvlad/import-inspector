import { Dict } from "~/lib/dict.ts";
import type { Import_v2, ImportsDict_v2 } from "~/api.ts";

export class ImportsDict extends Dict<Import_v2> implements ImportsDict_v2 {
	get ids() {
		return this.toKeys();
	}
}

