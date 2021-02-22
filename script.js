'use strict';
const c_to_l = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

/**
* initialize initial display
* @global
* @function window.onload
*/
window.onload = function() {
	display.init();
};

/**
 * The console gives players info about the game via text.
 * @class GameConsole
 */
let GameConsole = {
	row: document.getElementById("console-row"),
	message_list: document.getElementById("console-messages"),
	messages_active: 0,

	/**
	 * Write a new message to the console.
	 * @memberOf GameConsole
	 * @function write
	 * @param {string} new_text - Text of message.
	 * @param {boolean} is_instruction - Indicates whether the message should be displayed as an instruction to the players.
	 */
	write: function(new_text, is_instruction) {
		let msg = new_text;
		let li = document.createElement("li");

		if (is_instruction) {
			msg = "Game: " + new_text;
			li.classList.add("game-msg");
		}
		let text = document.createTextNode(msg);
		li.appendChild(text);
		this.message_list.appendChild(li);
		this.messages_active++;

		// Remove oldest message when list grows.
		if(this.messages_active > 5) {
			this.message_list.childNodes[0].remove();
		}
	},

	/**
	 * Remove the text from the console.
	 * @memberOf GameConsole
	 * @function clearText
	 */
	clearText: function() {
		let messages = this.message_list.childNodes;
		for(let m in messages) {
			m.remove();
		}
	},

	/**
	 * Remove console from screen.
	 * @memberOf GameConsole
	 * @function hide
	 */
	hide: function() {
		this.row.style.display = 'none';
	},

	/**
	 * Show console on screen.
	 * @memberOf GameConsole
	 * @function show
	 */
	show: function() {
		this.row.style.display = 'block';
	},
};

/**
 * The display handles all visual representations needed for the game.
 * @class display
 */
let display = {
	playGame: "",

	red_big_grid: document.getElementById("redBigGrid"),
	red_big_con: document.getElementById("redBigContainer"),

	red_small_grid: document.getElementById("redSmallGrid"),
	red_small_con: document.getElementById("redSmallContainer"),

	blue_big_grid: document.getElementById("blueBigGrid"),
	blue_big_con: document.getElementById("blueBigContainer"),

	blue_small_grid: document.getElementById("blueSmallGrid"),
	blue_small_con: document.getElementById("blueSmallContainer"),

	start_menu: document.getElementById("start-menu"),
	reset_btn: document.getElementById("reset"),
	start_btn: document.getElementById("start"),
	flip_ship_btn: document.getElementById("orientation"),
	ship_selectors: document.getElementsByClassName("ship-sel"),

	noClick: false,
	gameStart: true, // determines if the game has started or not
	mainMenu: "", // varaible that represents the canvas for the menu background

	/**
	* Set event listeners and create grids.
	* @memberOf display
	* @function init
	*/
	init: function() {
		this.reset();
		this.setEventListeners();
		this.initGrid(this.blue_big_grid);
		this.initGrid(this.blue_small_grid);
		this.initGrid(this.red_big_grid);
		this.initGrid(this.red_small_grid);
	},

	/**
	* Sets event listeners for the elements existing when the page is loaded, i.e. not the grids.
	* @memberOf display
	* @function setEventListeners
	*/
	setEventListeners: function() {
		this.start_btn.addEventListener("click", () => {
			for(let i=0; i < this.ship_selectors.length; i++)
			{
				if(this.ship_selectors[i].classList.contains("selected"))
				{
					this.playGame.shipNum = i+1;
					this.playGame.init(i+1);
					// initalize player ship count here;
				}
			}
			if(this.playGame.shipNum != 0)
			{
				this.hideStartBtn();
				this.showResetBtn();
				this.hideStartMenu();
				this.showBlueBigGrid();
				this.showBlueSmallGrid();
				this.showFlipBtn();
				GameConsole.show();
				GameConsole.write("Blue, place your ships on the left grid. Your ship will extend down or rightward from the box you click.", true);
			}
			else
			{
				alert("Select a ship count first."); //display this in a text box in display
			}


		});

		this.reset_btn.addEventListener("click", () => {
			this.reset();
			location.reload();
		});

		// Mouseover, mouseout, and selection for ship selection buttons.
		for(let i=0; i < this.ship_selectors.length; i++) {
			this.ship_selectors[i].addEventListener("mouseover", () => {
				this.ship_selectors[i].classList.add("hover")
			});
			this.ship_selectors[i].addEventListener("mouseout", () => {
				this.ship_selectors[i].classList.remove("hover")
			});
			this.ship_selectors[i].addEventListener("click", () => {
				// First deselect if any other box was selected.
				for(let j=0; j < this.ship_selectors.length; j++) {
					if(j !== i) {
						this.ship_selectors[j].classList.remove("selected");
					}
				}

				// Now select or deselect depending on state.
				if(this.ship_selectors[i].classList.contains("selected")) {
					this.ship_selectors[i].classList.remove("selected");
				} else {
					this.ship_selectors[i].classList.add("selected");
				}
			});
		}

		this.flip_ship_btn.addEventListener("click", () => { // allows the user to orient their ships on the board
			if(this.flip_ship_btn.innerText == "Turn Ship Horizontal")
			{
				this.playGame.shipOrient = 'H';
				this.flip_ship_btn.innerText = "Turn Ship Verticle";
			}
			else
			{
				this.playGame.shipOrient = 'V';
				this.flip_ship_btn.innerText = "Turn Ship Horizontal";
			}
		});
	},

	/**
	* Sets event listeners on a given box.
	* @memberOf display
	* @function setBoxEventListeners
	* @param {object} grid_box_ref grid box reference
	* @return {object} grid_box_ref
	*/
	setBoxEventListeners: function(grid_box_ref) {


		grid_box_ref.addEventListener("mouseover", () => {
			grid_box_ref.classList.add("hover");
		});

		grid_box_ref.addEventListener("mouseout", () => {
			grid_box_ref.classList.remove("hover");
		});

		grid_box_ref.addEventListener("click", (e) => {
			// This doesn't allow the small grid boxes to get clicked.
			if( !grid_box_ref.classList.contains("can-click") ) {
				return;
			}
			// Check whether we're still in the ship placement phase.
			if(this.playGame.shipsPlaced)
			{
				if(this.noClick === true) // checks to see if function is waiting on setTimeout to perform board transition
				{
					e.stopPropagation();
					e.preventDefault();
				}
				else
				{
					this.hideFlipBtn();
					this.drawBoard(this.blue_small_grid,this.playGame.p1.ship);
					this.drawBoard(this.red_small_grid,this.playGame.p2.ship);
					this.playGame.midgame(this.parseID(grid_box_ref.id));
					this.noClick = true;
					if(this.playGame.playerTurn)
					{
						setTimeout(() =>
						{
							this.hideBlueBigGrid();
							this.hideBlueSmallGrid();
							this.drawBoard(this.red_small_grid,this.playGame.p2.ship);
							this.showRedBigGrid();
							this.showRedSmallGrid();
							this.noClick = false;

						}, 3000);
					}
					else
					{
						setTimeout( () => {
							this.hideRedBigGrid();
							this.hideRedSmallGrid();
							this.drawBoard(this.blue_small_grid,this.playGame.p1.ship);
							this.showBlueBigGrid();
							this.showBlueSmallGrid();
							this.noClick = false;
						}, 3000);
					}
					this.playGame.playerTurn = !this.playGame.playerTurn;
				}

			}
			else
			{
				if(this.playGame.placeShip(this.parseID(grid_box_ref.id))) // calls the placeShip function with the clicked cell's id
				{
					grid_box_ref.classList.add("has-ship"); // if it has a ship it is assigned the has-ship class
					this.drawBoard(this.blue_big_grid,this.playGame.p1.ship);
					this.drawBoard(this.red_big_grid,this.playGame.p2.ship);
					if(this.playGame.p2.shipcount === 0)
					{
						this.playGame.shipsPlaced = true;
						this.playGame.p1.shipcount = this.shipNum;
						this.playGame.p2.shipcount = this.shipNum;
						this.hideFlipBtn();
						this.hideRedBigGrid();
						this.showBlueBigGrid();
						this.drawBoard(this.blue_small_grid,this.playGame.p1.ship);
						this.clearBoard(this.blue_big_grid,this.playGame.p1.ship);
						this.drawBoard(this.red_small_grid,this.playGame.p2.ship);
						this.clearBoard(this.red_big_grid,this.playGame.p2.ship);
					}
				}
				else
					GameConsole.write("You cannot place a ship on that square.", true);
				}
		});

		return grid_box_ref;
	},

	/**
	 * hide flip button
	 * @memberOf display
	 * @function hideFlipBtn
	 */
	hideFlipBtn: function() {
		this.flip_ship_btn.style.display = "none";
	},

	/**
	 * show flip button
	 * @memberOf display
	 * @function showFlipBtn
	 */
	showFlipBtn: function() {
		this.flip_ship_btn.style.display = "block";
	},

	/**
	 * hide reset button
	 * @memberOf display
	 * @function hideResetBtn
	 */
	hideResetBtn: function() {
		this.reset_btn.style.display = "none";
	},

	/**
	 * show reset button
	 * @memberOf display
	 * @function showResetBtn
	 */
	showResetBtn: function() {
		this.reset_btn.style.display = "block";
	},

	/**
	 * hide start button
	 * @memberOf display
	 * @function hideStartBtn
	 */
	hideStartBtn: function() {
		this.start_btn.style.display = "none";
	},

	/**
	 * show start button
	 * @memberOf display
	 * @function showStartBtn
	 */
	showStartBtn: function() {
		this.start_btn.style.display = "block";
	},

	/**
	 * hide start menu
	 * @memberOf display
	 * @function hideStartMenu
	 */
	hideStartMenu: function() {
		this.start_menu.style.display = "none";
	},

	/**
	 * show start menu
	 * @memberOf display
	 * @function showStartMenu
	 */
	showStartMenu: function() {
		this.start_menu.style.display = "block";
	},

	/**
	 * hide big red grid
	 * @memberOf display
	 * @function hideRedBigGrid
	 */
	hideRedBigGrid: function() {
		this.red_big_con.style.display = "none";
		this.red_big_grid.style.display = "none";
	},

	/**
	 * show big red grid
	 * @memberOf display
	 * @function showRedBigGrid
	 */
	showRedBigGrid: function() {
		this.red_big_con.style.display = "flex";
		this.red_big_grid.style.display = "table";
	},

	/**
	 * show red small grid
	 * @memberOf display
	 * @function showRedSmallGrid
	 */
	showRedSmallGrid: function() {
		this.red_small_con.style.display = "flex";
		this.red_small_grid.style.display = "table";
	},

	/**
	 * hide red small grid
	 * @memberOf display
	 * @function hideRedSmallGrid
	 */
	hideRedSmallGrid: function () {
		this.red_small_con.style.display = "none";
		this.red_small_grid.style.display = "none";
	},

	/**
	 * hid blue big grid
	 * @memberOf display
	 * @function hideBlueBigGrid
	 */
	hideBlueBigGrid: function() {
		this.blue_big_con.style.display = "none";
		this.blue_big_grid.style.display = "none";
	},

	/**
	 * show big blue grid
	 * @memberOf display
	 * @function showBlueBigGrid
	 */
	showBlueBigGrid: function() {
		this.blue_big_con.style.display = "flex";
		this.blue_big_grid.style.display = "table";
	},

	/**
	 * hide blue small grid
	 * @memberOf display
	 * @function hideBlueSmallGrid
	 */
	hideBlueSmallGrid: function() {
		this.blue_small_con.style.display = "none";
		this.blue_small_grid.style.display = "none";
	},

	/**
	 * show blue small grid
	 * @memberOf display
	 * @function ShowBlueSmallGrid
	 */
	showBlueSmallGrid: function() {
		this.blue_small_con.style.display = "flex";
		this.blue_small_grid.style.display = "table";
	},

	/**
	 * hide all visual displays
	 * @memberOf display
	 * @function hidAll
	 */
	hideAll: function() {
		this.hideStartMenu();
		this.hideBlueBigGrid();
		this.hideRedBigGrid();
		this.hideBlueSmallGrid();
		this.hideRedSmallGrid();
		this.hideStartBtn();
		this.hideResetBtn();
		this.hideFlipBtn();
		GameConsole.hide();
	},

	/**
	 * reset display
	 * @memberOf display
	 * @function reset
	 */
	reset: function() {
		this.hideAll();
		this.showStartMenu();
		this.showStartBtn();
		this.noClick = false;
	},

	/**
	 * Initializes a grid given a node of a table element. Only called once per table, unless you want to reset it.
	 * @memberOf display
	 * @function initGrid
	 * @param {object} table_ref - reference table
	 */
	initGrid: function(table_ref) {
		let headrow = document.createElement('tr');
		let box = document.createElement("th"); // adds an extra th element to offset the column labels
		if(table_ref.classList.contains("big-grid")) {
			box.classList.add("can-click")
		}
		box.classList.add("grid-box");
		box.classList.add("head");
		headrow.appendChild(box);
		for(let i=0; i < 10; i++) {
			box = document.createElement("th");
			box.classList.add("grid-box");
			if(table_ref.classList.contains("big-grid")) {
				box.classList.add("can-click")
			}
			box.classList.add("head");
			box.innerText = String.fromCharCode(65+i); // labels the columns
			headrow.appendChild(box);
		}
		table_ref.appendChild(headrow);

		for(let i=0; i < 10; i++) {
			let row = document.createElement('tr');
			row.classList.add("grid-row");
			let tempBox = document.createElement('td'); // creates an extra td element on the front of each row to hold the row label
			tempBox.classList.add("grid-box");
			if(table_ref.classList.contains("big-grid")) {
				tempBox.classList.add("can-click")
			}
			tempBox.classList.add("head");
			tempBox.style.borderStyle = "none";
			tempBox.innerText = (i+1) + "";
			row.appendChild(tempBox);
			for(let j=0; j < 10; j++) {
				let box = document.createElement('td');
				box.classList.add("grid-box");
				if(table_ref.classList.contains("big-grid")) {
					box.classList.add("can-click")
				}
				box.id = "e" + "" + i + "" + j; // added an e to the begginning of the id because css doesnt allow ids beginning w/ numbers. ParseID will ignore
				box = this.setBoxEventListeners(box);

				row.appendChild(box);
			}
			table_ref.appendChild(row);
		}
	},

	/**
	 * parseID
	 * @memberOf display
	 * @function parseID
	 * @param {number} num - number
	 * @return {number} - the sum of num1 and num2
	 */
	parseID: function(num) {
		return [parseInt(num[1]),parseInt(num[2])];
	},

	/**
	 * draw board
	 * @memberOf display
	 * @function drawBoard
	 * @param {object} table_ref - table of reference
	 * @param {object} board game board
	 */
	drawBoard: function(table_ref,board){ //expand on this
		for(let i=0;i<10;i++){
			for(let j=0;j<10;j++){
				if(board[i][j] == 'S')
					table_ref.querySelector("#e" + i + "" + j).classList.add("has-ship");
				if(board[i][j] == 'X')
					table_ref.querySelector("#e" + i + "" + j).classList.add("hit-ship");
				if(board[i][j] == 'o')
					table_ref.querySelector("#e" + i + "" + j).classList.add("miss-ship");
			}
		}
	},

	/**
	 * Clear visual display of colors.
	 * @function clearBoard
	 * @memberOf display
	 * @param {object} table_ref - Table holding ships.
	 * @param {array} board - Array representation of the board from the game class.
	 */
	clearBoard: function(table_ref,board){
		for(let i=0;i<10;i++){
			for(let j=0;j<10;j++){
				if(board[i][j] == 'S')
					table_ref.querySelector("#e" + i + "" + j).classList.remove("has-ship");
				if(board[i][j] == 'X')
					table_ref.querySelector("#e" + i + "" + j).classList.remove("hit-ship");
				if(board[i][j] == 'o')
					table_ref.querySelector("#e" + i + "" + j).classList.remove("miss-ship");
			}
		}
	}
};

// display.drawGrid();
// display.drawMainMenu();
// display.drawMiniMap();

/**
 * establish player class
 * @class player
 */
let player = function () {
	this.hm = [];
	this.ship = [];
	this.shipcount = 0;
	this.hitstowin = 0;
	this.hits = 0;

	/**
	 * take user input and react
	 * @memberOf player
	 * @function incoming
	 * @param {number} col - columns
	 * @param {number} row - rows
	 * @return {boolean} - return if hit, false otherwise
	 */
	this.incoming = function (col, row){
		if (this.ship[row][col] === 'S') {
				this.ship[row][col] = 'X';
				GameConsole.write("Hit at " + c_to_l[col] + (row+1) + "!", false);
				return (true);
		}
		else {
			this.ship[row][col] = 'o';
			GameConsole.write("Miss at " + c_to_l[col] + (row+1)  + ".", false);
			return (false);
		}
	};

	/**
	 * gameover
	 * @memberOf player
	 * @function gameover
	 */
	this.gameover= function(){
		return (this.hits == this.hitstowin);
	};

	/**
	 * setup game grid and ship counts
	 * @memberOf player
	 * @function setup
	 */
	this.setup = function() {
		for (let i = 0; i < 10; i++) {
			this.hm[i] = [];
			this.ship[i] = [];
        }

		for (let i = 0; i < 10; i++) {
			for (let j = 0; j < 10; j++) {
				this.ship[i][j] = '-';
				this.hm[i][j] = '-';
			}
		}

		for (let i = 1; i <= this.shipcount; i++) {
			this.hitstowin += i;
		}
	};

	/**
	 * firing the ships, return if hit or not
	 * @memberOf player
	 * @function fire
	 * @param {object} other - other player input
	 * @param {number} row -rows
	 * @param {number} col - columns
	 * @return {boolean} - hit
	 */
	this.fire=function(other, row, col){
		let hit = false;

		if(other.incoming(col, row)) {

			this.hm[row][col] = 'X';
			hit = true;
			this.hits += 1;
		}
		else {
			this.hm[row][col] = 'o';
			hit = false;
		}

		return (hit);
	};

	/**
	 * setting down the ships
	 * @memberOf player
	 * @function setDown
	 * @param {number} length - length of ship
	 * @param {number} col - column
	 * @param {number} row - row
	 * @param {string} vert - if ship is vertical
	 * @return {boolean} - check if empty
	 */
	this.setdown=function(length, col, row, vert){
		let checkifempty = 0;
		if (length == 1) {

			if (this.ship[row][col] == '-') {
				this.ship[row][col] = 'S';
			}
			else
			{
				checkifempty = 1;
			}


		}
		else {

			if (vert == 'V') {
				for(let i = 0; i < length; i++) {
					if(typeof this.ship[row + i] !== 'undefined')
					{
						if(this.ship[row + i][col] != '-') {
							checkifempty = 1;

						}
					}
					else
					{
						checkifempty = 1;
					}

				}
				if(checkifempty == 0) {
					for(let i = 0; i < length; i++) {
						this.ship[row + i][col] = 'S';
					}
				}

			}
			else {
				for (let i = 0; i < length; i++) {
					if(typeof this.ship[row][col + i] !== 'undefined')
					{
						if (this.ship[row][col + i] != '-') {
							checkifempty += 1;

						}
					}
					else
					{
						checkifempty = 1;
					}
				}
				if(checkifempty == 0) {
					for (let i = 0; i < length; i++) {
						{
							this.ship[row][col + i] = 'S';
						}
					}
				}
			}
		}
		return checkifempty;
	};
}

/**
 * play function that drives the game
 * @class play
 * @param {object} plr1 -player 1 object
 * @param {object} plr2 - player 2 object
 * @param {object} disp - display object
 */
let play = function(plr1,plr2,disp) {
	this.p1 = plr1;
	this.p2 = plr2;
	this.init = (n) => { this.p1.shipcount = n; this.p1.setup(); this.p2.shipcount = n; this.p2.setup(); };
	this.display = disp;
	this.shipsPlaced = false;
	this.playerTurn = true;
	this.shipNum = 0;
	this.shipOrient = 'V';

	/**
	 * place ship is called when a grid-box is clicked and shipsPlaced is equal to false
	 * @memberOf play
	 * @function placeship
	 * @param {number} id - identification
	 * @return {boolean} if placed return true, else turn false
	*/
	this.placeShip = function(id) {
		let placed = false;
		let row = id[0];
		let col = id[1];
		if(this.p1.shipcount !== 0 || this.p2.shipcount !== 0)
		{
			if(this.p1.shipcount !== 0)
			{
				console.log(row + " " + col);
				if(this.p1.setdown(this.p1.shipcount,col,row,this.shipOrient) === 0)
				{
					GameConsole.write("Blue placed a ship at a secret location.");
					placed = true;
					this.p1.shipcount--;
				}
				if(this.p1.shipcount === 0)// catches the last ship placement and switches boards
				{
					GameConsole.write("Red, place your ships on the left grid. Your ship will extend down or rightward from the box you click.", true);
					this.display.hideBlueBigGrid();
					this.display.showRedBigGrid();
				}
			}
			else
			{
				if(this.p2.setdown(this.p2.shipcount,col,row,this.shipOrient) === 0)
				{
					GameConsole.write("Red placed a ship at a secret location.");
					placed = true;
					this.p2.shipcount--;
				}
			}
		}
		return placed;
	};

	/**
   	 * middle of the game
		 * @memberOf play
		 * @function midgame
  	 */
	this.midgame=function(id){
		let row = id[0];
		let col = id[1];
		let gover = false;
		if(!(this.p1.gameover()) && !(this.p2.gameover()))
		{
			if(this.playerTurn)
			{
				GameConsole.write("Blue fired!");
				if(this.p1.fire(this.p2, row, col))
				{
					this.display.blue_big_grid.querySelector("#e" + row + "" + col).classList.add("hit-ship");
					if (this.p1.gameover())
					{
						this.endgame();
					}
				}
				else
				{
					this.display.blue_big_grid.querySelector("#e" + row + "" + col).classList.add("miss-ship");
				}
			}
			if(!this.playerTurn)
			{
				GameConsole.write("Red fired!");
				if(this.p2.fire(this.p1, row, col))
				{
					display.red_big_grid.querySelector("#e" + row + "" + col).classList.add("hit-ship");
					if (this.p2.gameover())
					{
						this.endgame();
					}
				}
				else
				{
					this.display.red_big_grid.querySelector("#e" + row + "" + col).classList.add("miss-ship");
				}
			}
		}
	};

	/**
	 * end of game
	 * @memberOf play
	 * @function endgame
	 */
	this.endgame=function(){
		if (this.p1.gameover() == true){
			GameConsole.write("Game over. Blue wins!", true);
		}else{
			GameConsole.write("Game over. Red wins!", true)
		}
		setTimeout(() => { this.display.noClick = true; }, 3001);
	}
};


let player1 = new player;
let player2 = new player;
display.playGame = new play(player1,player2,display);
