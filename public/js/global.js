resetPageElements = function () {
	var elements = document.getElementsByClassName("page-element"),
		elementCount = elements.length;

	while (elementCount--) {
		elements[elementCount].style.display = "none";
	}
}

hashKeyNavigation = function () {
	var page = document.location.hash.substr(1),
		element = document.getElementById(page);

	resetPageElements();
	if (element !== null && element.className === "page-element") {
		element.style.display = "inline";
	}else if ((element = document.getElementsByClassName("page-element")).length > 0) {
		element[0].style.display = "inline";
	}
}

initPage = function () {
	hashKeyNavigation();
	window.onhashchange = hashKeyNavigation;
}

initRequsts.push(initPage);