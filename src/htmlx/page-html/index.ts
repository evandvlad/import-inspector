import { assetsManager } from "./assets-manager.ts";

export function getPageHtml(html: string) {
	return `
		<!doctype html>
		<html lang="en">
			<head>
				<meta charset="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<style>
					${assetsManager.styles}
				</style>
				<script>
					document.addEventListener("DOMContentLoaded", () => {
						document.body.classList.add("ready");
					}, false);
				</script>
			</head>
			<body>
				${html}
				<script>
					${assetsManager.scripts}
				</script>
			</body>
		</html>
	`;
}
