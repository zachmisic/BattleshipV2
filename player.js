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
	this.specialShot = 2;

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
 * firing the ships with a special shot, return if hit or not
 * @memberOf player
 * @function specialFire
 * @param {object} other - other player input
 * @param {number} row -rows
 * @param {number} col - columns
 * @return {boolean} - hit
 */
this.specialFire=function(other, row, col){
	let hit = false;

	if(other.incoming(col, row)) {

		this.hm[row][col] = 'X';
		hit = true;
		this.hits += 1;
	}
	if(other.incoming(col+1, row)) {

		this.hm[row][col+1] = 'X';
		hit = true;
		this.hits += 1;
	}
	if(other.incoming(col-1, row)) {

		this.hm[row][col-1] = 'X';
		hit = true;
		this.hits += 1;
	}
	if(other.incoming(col, row+1)) {

		this.hm[row+1][col] = 'X';
		hit = true;
		this.hits += 1;
	}
	if(other.incoming(col, row-1)) {

		this.hm[row-1][col] = 'X';
		hit = true;
		this.hits += 1;
	}
	if(other.incoming(col+1, row-1)) {

		this.hm[row-1][col+1] = 'X';
		hit = true;
		this.hits += 1;
	}
	if(other.incoming(col+1, row+1)) {

		this.hm[row+1][col+1] = 'X';
		hit = true;
		this.hits += 1;
	}
	if(other.incoming(col-1, row-1)) {

		this.hm[row-1][col-1] = 'X';
		hit = true;
		this.hits += 1;
	}
	if(other.incoming(col-1, row+1)) {

		this.hm[row+1][col-1] = 'X';
		hit = true;
		this.hits += 1;
	}
	else {
		this.hm[row][col] = 'o';
		hit = false;
	}

	this.specialShot--;
	return (hit);
};
