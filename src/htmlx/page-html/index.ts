import sass from "sass";

import scssStyles from "./styles.scss" with { type: "text" };
import scripts from "./scripts.js" with { type: "text" };

const styles = sass(scssStyles).to_string();

export function getPageHtml(html: string) {
	return `
		<!doctype html>
		<html lang="en">
			<head>
				<meta charset="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<style>
					${styles}
				</style>
			</head>
			<body>
				${html}
				<script>
					${scripts}
				</script>
			</body>
		</html>
	`;
}
