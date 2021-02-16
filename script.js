let display = {
	grid: document.querySelector("body").appendChild(document.createElement("table")), // the table used for the grid
	miniMap: document.querySelector('body').appendChild(document.createElement('table')), // the table used for the player's ship view
	gameStart: true, // determines if the game has started or not
	mainMenu: "", // varaible that represents the canvas for the menu background
	/*	
		Function: init
		Takes: NONE
		Returns: a 10x10 table HTML element
						function uses the .appendChild method to add 10 rows and 10 units per row to the table.
		as the column elements are created, they are assigned a unique ID number "##" where the
		first # is the row number and the secnd # is the column number. an eventListener is also
		added to each column elements, that will detect 
	*/
	drawGrid: function() {
		display.grid.id = "grid";
		let ident = document.createElement('div');
		let row = ""; // <tr> html element for table rows
		let elem = ""; // grid cell
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
				if(display.gameStart) {
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
	},
	
	drawMiniMap: function() {
		display.miniMap.id = "mini-map";
		let ident = document.createElement('div');
		let row = "";
		let elem = "";
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
			row = display.miniMap.appendChild(document.createElement("tr"));
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
	},
	
	/*
		Takes: NONE
		Returns: NONE

		function initializes the menu screen. It creates a new menu elements and appends them onto the body/background.
		It also assignes them specific IDs so they will get styled by the css in index.html. After creation,
		the elements are formatted in case of a griz size change.
		
		Creates Elements: "main-menu", "title", "start-button"
	*/
	drawMainMenu: function() {
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
		startBtn.addEventListener("click", () => { mainMenu.innerHTML = ""; display.drawSelMenu();});
		
	},

	/*
		Takes: NONE
		Returns: NONE
		
		function initilaizes the selection menu and allows user to choose number of ships to play with. each selection
		element has en event listener that listens for a click, and then calls a set ship # function.
	*/
	drawSelMenu: function() {
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
	},
	/*
		Takes: n => number of the largest ship
		Returns: NONE
	
		function takes in the number of the largest ship in the fleet, and creates a block representation of it. This is purely visual and provides no functionality.
	*/
	drawShip: function(n) {
		let head = "";
		for(let i=0;i<n;i++)
		{
			head = document.createElement('div');
			head.style = "position: absolute; left: 100px; top: " + (100+(20*i)) + "px; width: 20px; height: 20px; border-style: solid;";
			document.querySelector('body').appendChild(head);
		}
	}
}

display.drawGrid();
display.drawMainMenu();
display.drawMiniMap();

/*
	Takes: id(string) from selected unit
	Returns: the row and column of the id
	
 	function uses the string from the units id to parse the row # and column #
*/
function parseID(num) {
	return [num[0],num[1]];
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

