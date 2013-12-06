initPage = function () {
	var accessPages = ['home', 'gedichten'],
		page = document.location.search.substr(1),
		element = document.getElementById(page);

	if (element !== null && accessPages.indexOf(page) >=0) {
		element.style.visibility = "visible";
	}else if (accessPages.length > 0) {
		document.getElementById(accessPages[0]).style.visibility = "visible";
	}
}

initRequsts.push(initPage);