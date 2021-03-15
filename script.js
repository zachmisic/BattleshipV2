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
	 * placeSpecial is called when a grid-box is clicked
	 * @memberOf play
	 * @function placeSpecial
	 * @param {number} id - identification
	 * @return {boolean} if placed return true, else turn false
	*/
	this.placeSpecial = function(id) {
		let placedSpecial = false;
		let row = id[0];
		let col = id[1];
		if(this.p1.specialShot !== 0 || this.p2.specialShot !== 0)
		{
			if(this.p1.specialShot !== 0)
			{
				if(this.p1.setdown(this.p1.shipcount,col,row,this.shipOrient) === 0)
				{
					//Somehow need to connect the display [Special Shot] button with the actual game.
					//Where once the special shot button is clicked, the next time you click on a grid
					//All bordering shots in a 3x3 are hit.

					//Based on the project we were given, you can hit a location as many times as you want.
					//Nothing prevents you from shooting a location you already shot.

					//The best step to get this implemented, would be to make it spit out the location I chose.
					//So if I click [Special Shot] then I choose A1, the game should say "special shot at A1"
					//Which would be a step closer to incorporating the shots around the center
				}
			}
			else
			{
				if(this.p2.setdown(this.p2.shipcount,col,row,this.shipOrient) === 0)
				{

				}
			}
		}
		return placedSpecial;
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


/**
 * play function that drives the game
 * @class play
 * @param {object} plr1 -player 1 object
 * @param {object} ai - ai object
 * @param {object} disp - display object
 */
let playAI = function(plr1, ai,disp) {
	this.p1 = plr1;
	this.p2 = ai;
	this.init = (n) => { this.p1.shipcount = n; this.p1.setup(); this.p2.shipcount = n;};
	this.display = disp;
	this.shipsPlaced = false;
	this.playerTurn = true;
	this.shipNum = 0;
	this.shipOrient = 'V';


	/**
	 * place ship is called when a grid-box is clicked and shipsPlaced is equal to false
	 * @memberOf playAI
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
				if(this.p2.placeShips(this.p2.shipcount))
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
	 * placeSpecial is called when a grid-box is clicked
	 * @memberOf play
	 * @function placeSpecial
	 * @param {number} id - identification
	 * @return {boolean} if placed return true, else turn false
	*/
	this.placeSpecial = function(id) {
		let placedSpecial = false;
		let row = id[0];
		let col = id[1];
		if(this.p1.specialShot !== 0 || this.p2.specialShot !== 0)
		{
			if(this.p1.specialShot !== 0)
			{
				if(this.p1.setdown(this.p1.shipcount,col,row,this.shipOrient) === 0)
				{
					//Somehow need to connect the display [Special Shot] button with the actual game.
					//Where once the special shot button is clicked, the next time you click on a grid
					//All bordering shots in a 3x3 are hit.

					//Based on the project we were given, you can hit a location as many times as you want.
					//Nothing prevents you from shooting a location you already shot.

					//The best step to get this implemented, would be to make it spit out the location I chose.
					//So if I click [Special Shot] then I choose A1, the game should say "special shot at A1"
					//Which would be a step closer to incorporating the shots around the center
				}
			}
		}
		return placedSpecial;
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
				if(display.ai == 1)
				{
					if(this.p2.easyFire(this.p1))
					{
						if (this.p2.gameover())
						{
							this.endgame();
						}
					}
				}
				else if(display.ai == 2)
				{
					if(this.p2.mediumFire(this.p1))
					{
						if (this.p2.gameover())
						{
								this.endgame();
						}
					}
				}
				else if(display.ai == 3)
				{
					if(this.p2.hardFire(this.p1))
					{
						if (this.p2.gameover())
						{
							this.endgame();
						}
					}
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
let ai = new AI;
if(display.ai == 0)
{
	display.playGame = new play(player1,player2,display);
}
else
{
	display.playGame = new playAI(player1, ai, display)
}
