import css from "./page.css" with { type: "text" };

export function getPageHtml(html: string) {
	return `
		<!doctype html>
		<html lang="en">
			<head>
				<meta charset="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<style>
					${css}
				</style>
			</head>
			<body>
				${html}
			</body>
		</html>
	`;
}
