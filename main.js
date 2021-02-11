let turn = false;
let mainMenu = "";
let title = "";
let startBtn = "";

/*
	Takes: None
	Returns: None

	function initializes the menu screen. It creates a new menu elements and appends them onto the body/background.
	It also assignes them specific IDs so they will get styled by the css in index.html. After creation,
	the elements are formatted in case of a griz size change.
	
	Creates Elements: "main-menu", "title", "start-button"
*/
function initMenu() {
	// main menu
	mainMenu = document.querySelector('body').appendChild(document.createElement('div'));
	mainMenu.id = "main-menu";
		// mainMenu formatting
	mainMenu.style.width = (grid.offsetWidth-2) + "";
	mainMenu.style.height = (grid.offsetHeight-2) + "";
	mainMenu.style.top = grid.offsetTop + "";
	mainMenu.style.left = grid.offsetLeft + "";
	// title text
	title = document.querySelector('#main-menu').appendChild(document.createElement('div'));
	title.id = "title";
	title.innerText = "BATTLESHIP";
		// title formatting
	title.style.top = ((mainMenu.offsetHeight / 2) - (title.offsetHeight)) + "";
	title.style.left = ((mainMenu.offsetWidth / 2) - (title.offsetWidth / 2)) + "";
	// start button
	startBtn = document.querySelector('#main-menu').appendChild(document.createElement('button'));
	startBtn.id = "start-button";
	startBtn.innerText = "Start!";
		//start button formatting
	startBtn.style.top = (title.offsetTop + 40) + "";
	startBtn.style.left = (title.offsetLeft + (title.offsetLeft/2)/2) + "";
	startBtn.addEventListener("click", () => { mainMenu.innerHTML = ""; mainMenu.remove();});

	
}

initMenu();
// main menu
