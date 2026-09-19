export type Command =
	| { name: "help" }
	| { name: "version" }
	| { name: "write-api-file" }
	| { name: "display-config" }
	| { name: "inspect"; preset: string }
	| { name: "set-settings-path"; path: string; preset: string }
	| { name: "unknown" };
