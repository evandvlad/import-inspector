Array.from(document.querySelectorAll("[data-js-flist]")).forEach((container) => {
	const id = container.getAttribute("data-js-flist");
	const inputElement = container.querySelector(`[data-js-flist-input="${id}"]`);
	const itemElements = Array.from(container.querySelectorAll(`[data-js-flist-item="${id}"]`));

	inputElement.addEventListener("input", (e) => {
		filterValue = e.target.value.trim();

		itemElements.forEach((itemElement) => {
			const itemValue = itemElement.getAttribute(`data-js-flist-value`);
			const isVisible = itemValue.includes(filterValue);

			if (isVisible) {
				itemElement.removeAttribute("hidden");
			} else {
				itemElement.setAttribute("hidden", "");
			}
		});
	});
});
