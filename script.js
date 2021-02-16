let grid = document.querySelector("body").appendChild(document.createElement("table")); // the table used for the grid
grid.id = "grid";
let miniMap = document.querySelector('body').appendChild(document.createElement('table')); // the table used for the player's ship view
miniMap.id = "mini-map";
let row = ""; // <tr> html element for table rows
let elem = ""; // grid cell
let start = true; // determines if the game has started or not
let mainMenu = ""; // varaible that represents the canvas for the menu background
let head = ""; // is used to initialize new elements in buildShip(n) before they are appended to the body

/*
	Takes: n => number of the largest ship
	Returns: NONE
	
	function takes in the number of the largest ship in the fleet, and creates a block representation of it. This is purely visual and provides no functionality.
*/
function buildShip(n) {
	for(let i=0;i<n;i++)
	{
    head = document.createElement('div');
    head.style = "position: absolute; left: 500px; top: " + (100+(20*i)) + "px; width: 20px; height: 20px; border-style: solid;";
    document.querySelector('body').appendChild(head);
	}
}

/*
	Takes: id(string) from selected unit
	Returns: the row and column of the id
	
 	function uses the string from the units id to parse the row # and column #
*/
function parseID(num) {
	return [num[0],num[1]];
}

/*	
	Function: init
	Takes: NONE
	Returns: a 10x10 table HTML element
	
	function uses the .appendChild method to add 10 rows and 10 units per row to the table.
	as the column elements are created, they are assigned a unique ID number "##" where the
	first # is the row number and the secnd # is the column number. an eventListener is also
	added to each column elements, that will detect 
*/
function init() {
	let ident = document.createElement('div');
	ident.id = "identifiers";
	document.querySelector("body").appendChild(ident);
	for(let i=0;i<10;i++)
	{	
		// creates identifiers for the rows
		ident = document.createElement('div');
		ident.style = "position: absolute; top: 60px; left: " + ((44*i)+505) + "px; font-size: 20px; text-alight: center; padding: 10px; width: 30px; height: 30px;";
		ident.innerText = i+1
		document.querySelector("#identifiers").appendChild(ident);
		// creates identifiers for the columns
		ident = document.createElement('div');
		ident.style = "position: absolute; top: " + ((44*i)+105) + "px; left: 460px; font-size: 20px; text-alight: center; padding: 10px; width: 30px; height: 30 px;";
		ident.innerText = String.fromCharCode(65+i);
		document.querySelector("#identifiers").appendChild(ident);
		// creates the row element for the table
		row = grid.appendChild(document.createElement("tr"));
		for(let j=0;j<10;j++)
		{
			elem = document.createElement("td");
			elem.className = "grid-element";
			elem.id = "" + i + j;
			elem.addEventListener("click", (() => {	
			if(start) {
				document.getElementById("check").innerText = i + " " + j;
				document.getElementById(i + "" + j).style = "background-color: red;"; /*hitCheck*/
				console.log(i + "" + j);
				} 
				else { 
				/* place player current ship */
				}
			}));
			row.appendChild(elem);
		}
	}
}


function initMiniMap() {
	let ident = document.createElement('div');
	ident.id = "identifiers-mini";
	document.querySelector("body").appendChild(ident);
	for(let i=0;i<10;i++)
	{	
		// creates identifiers for the rows
		ident = document.createElement('div');
		ident.style = "position: absolute; top: 70px; left: " + ((13*i)+973) + "px; font-size: 15px; text-alight: center; padding: 10px; width: 30px; height: 30px;";
		ident.innerText = i+1
		document.querySelector("#identifiers").appendChild(ident);
		// creates identifiers for the columns
		ident = document.createElement('div');
		ident.style = "position: absolute; top: " + ((14*i)+88) + "px; left: 955px; font-size: 13px; text-alight: center; padding: 10px; width: 30px; height: 30 px;";
		ident.innerText = String.fromCharCode(65+i);
		document.querySelector("#identifiers").appendChild(ident);
		// creates the row element for the table
		row = miniMap.appendChild(document.createElement("tr"));
		for(let j=0;j<10;j++)
		{
			elem = document.createElement("td");
			elem.className = "mini-map-elem";
			elem.id = "" + i + j;
			//elem.addEventListener("click", (() => {	
			//document.getElementById("check").innerText = i + " " + j;
			//document.getElementById(i + "" + j).style = "background-color: red;"; /*hitCheck*/
			//console.log(i + "" + j);
			row.appendChild(elem);
		}
	}
}
	
/*
	Function: reset event listener
	Takes: NONE
	Returns: NONE
	
	the EventListener on the button id="reset" waits for a click on the button, and then runs a handler
	function that resets the inner contents of the <table></table> to and empty string(""). It then calls
	the init() function to repopulate the grid
*/
document.querySelector("#reset").addEventListener("click", () => {
	grid.innerHTML = "";
	init();
	initMenu();
});

/*
	Takes: NONE
	Returns: NONE

	function initializes the menu screen. It creates a new menu elements and appends them onto the body/background.
	It also assignes them specific IDs so they will get styled by the css in index.html. After creation,
	the elements are formatted in case of a griz size change.
	
	Creates Elements: "main-menu", "title", "start-button"
*/
function initMenu() {
	let title = "";
	let startBtn = "";
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
	startBtn.addEventListener("click", () => { mainMenu.innerHTML = ""; selMenu();});
	
}

/*
	Takes: NONE
	Returns: NONE
	
	function initilaizes the selection menu and allows user to choose number of ships to play with. each selection
	element has en event listener that listens for a click, and then calls a set ship # function.
*/
function selMenu() {
	let title = document.querySelector('#main-menu').appendChild(document.createElement('div'));
	let startBtn = "";
	title.id = "title";
	title.innerText = "Choose Number of Ships";
		// title formatting
	title.style.top = ((mainMenu.offsetHeight / 3) - (title.offsetHeight)) + "";
	title.style.left = ((mainMenu.offsetWidth / 2) - (title.offsetWidth / 2)) + "";
	// button formatting
	/* 
		you have to save the number i for each button so the event handler can select the specific id with the querySelector. 
		if you don't assign a unique id, the eventListner only works for the last element created.
	*/
	for(let i=0;i<6;i++)
	{
		startBtn = document.querySelector('#main-menu').appendChild(document.createElement('div'));
		startBtn.id = "btn" + i;
		startBtn.style = "position: absolute; left: " + ((i*(grid.offsetWidth/6)+9)) + "px; top: " + (grid.offsetHeight/2) + "px; z-index: 1; width: 50px; height: 50px; border-style: solid; font-size: 50; text-align: center;";
		startBtn.innerText = "" + (i+1);
		startBtn.addEventListener("mouseover", () => { document.querySelector(("#btn" + i)).style.backgroundColor = "red"; }); 
		startBtn.addEventListener("mouseout", () => { document.querySelector(("#btn" + i)).style.backgroundColor = ""; });
		startBtn.addEventListener("click", () => { document.querySelector(("#btn" + i)).style.backgroundColor = "green"; /* setNumShips(i); */ mainMenu.innerHTML = ""; mainMenu.remove(); });
		mainMenu.appendChild(startBtn);
	}
}

init();
initMiniMap();
initMenu();









function setdown(length , col, row, vert) {
	
	if (length == 1) {
		
		if (ship[row][col] == '-') {
			ship[row][col] = 'S';
		}
	

	}
	else {
		let checkifempty = 0;
		
		if (vert == 'V') {
		
			for (let i = 0; i < length; i++)
			{
				if (ship[row + i][col] != '-') {
					checkifempty += 1;

				}
			}

			if (checkifempty == 0) {
				for (let i = 0; i < length; i++) {
					ship[row + i][col] = 'S';
				}
			}
		
		}
		else {
			for (let i = 0; i < length; i++)
			{
				if (ship[row][col + i] != '-') {
					checkifempty += 1;

				}
			}

			if (checkifempty == 0) {
				for (let i = 0; i < length; i++)
				{
					ship[row][col + i] = 'S';
				}
			}
		}
	}};
function fire(other,row,col) {
	
	let hit = false;
	
	if (other.incoming(col, row)) {
		
		hm[row][col] = 'X';
		hit = true;
		hits += 1;
	}
	else {
		hm[row][col] = 'o';
		hit = false;
	}
	
	return(hit);

};
function incoming(col,row) {


		if (ship[row][col] == 'S') {
			ship[row][col] = 'X';
			return (true);
		}
		else {
			ship[row][col] = 'o';
			return (false);
	}
};
function setup(ships) {
	hm[0][0] = ' ';
	ship[0][0] = ' ';
	ship[0][1] = 'A';
	ship[0][2] = 'B';
	ship[0][3] = 'C';
	ship[0][4] = 'D';
	ship[0][5] = 'E';
	ship[0][6] = 'F';
	ship[0][7] = 'G';
	ship[0][8] = 'H';
	ship[0][9] = 'I';
	ship[0][10] = 'J';
	hm[0][1] = 'A';
	hm[0][2] = 'B';
	hm[0][3] = 'C';
	hm[0][4] = 'D';
	hm[0][5] = 'E';
	hm[0][6] = 'F';
	hm[0][7] = 'G';
	hm[0][8] = 'H';
	hm[0][9] = 'I';
	hm[0][10] = 'J';

	for (let i = 1; i < 10; i++)
	{
		hm[i][0] = i;
		ship[i][0] = i;
	}
	for (let i = 1; i < 11; i++)
	{
		for (let j = 1; j < 11; j++)
		{
			ship[i][j] = '-';
			hm[i][j] = '-';
		}
	}

	for (let i = 1; i <= shipcount; i++)
	{
		hitstowin += i;
	}
}
function gameover() {
	return (hits == hitstowin);
}

let player = { hm: new Array(11), ship: new Array(11), shipcount: 0, hitstowin: 0, hits: 0 };
