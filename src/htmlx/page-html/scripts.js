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

Array.from(document.querySelectorAll("[data-js-tabs]")).forEach((container) => {
	const id = container.getAttribute("data-js-tabs");
	const linkElements = Array.from(container.querySelectorAll(`[data-js-tabs-link="${id}"`));
	const contentElements = Array.from(container.querySelectorAll(`[data-js-tabs-content="${id}"]`));
	const len = linkElements.length;
	const activeClass = "active";

	function changeActiveStateByIndex(index) {
		for (let i = 0; i < len; i += 1) {
			const linkElement = linkElements[i];
			const contentElement = contentElements[i];
			const isVisible = index === i;

			if (isVisible) {
				linkElement.classList.add(activeClass);
				contentElement.removeAttribute("hidden");
			} else {
				linkElement.classList.remove(activeClass);
				contentElement.setAttribute("hidden", "");
			}
		}
	}

	linkElements[0].parentNode.addEventListener("click", (e) => {
		const activeLinkIndex = linkElements.indexOf(e.target);

		if (activeLinkIndex === -1) {
			return;
		}

		changeActiveStateByIndex(activeLinkIndex);
	});

	changeActiveStateByIndex(0);
});
