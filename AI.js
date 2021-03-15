/**
 * establish AI class
 * @class AI
 */

 let AI = function (){
   this.hm = [];
   this.ship = [];
   this.shipcount = 0;
   this.hitstowin = 0;
   this.hits = 0;
   this.mode = 0;

 let orientation = ['V','H'];

 /**
  * setting down the ships
  * @memberOf AI
  * @function placeShips
  * @param {number} length - length of ship
  * @return {boolean} - check if empty
  */
 this.placeShips=function(length){
   let checkifempty = 0;
   let row=Math.floor(Math.random() * 10); //random int 0 to 9
   let col=Math.floor(Math.random() * 10);
   let horVer = orientation[Math.floor(Math.random()*orientation.length)];
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

     if (horVer == 'V') {
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
   
   if(checkifempty == 0)
    hitstowin += length;
   
    return checkifempty;
 };


/**
 * easy mode firing
 * @memberOf AI
 * @function easyFire
 * @param {object} human - other player input
 * @return {boolean} - hit
 */
 this.easyFire=function(human){
   let hit = false;
   let rownum=Math.floor(Math.random() * 10); //random int 0 to 9
   let colnum=Math.floor(Math.random() * 10);
   if(human.incoming(colnum, rownum)) {

     this.hm[rownum][colnum] = 'X';
     hit = true;
     this.hits += 1;
   }
   else {
     this.hm[rownum][colnum] = 'o';
     hit = false;
   }

   return (hit);
 };

/**
 * medium mode firing
 * @memberOf AI
 * @function mediumFire
 * @param {object} human - other player input
 * @return {boolean} - hit
 */
  this.mediumFire=function(human){
    let hit = false;  //did the ai hit something
    let exit = false; //should I exit the search
    let rownum=Math.floor(Math.random() * 10); //random int 0 to 9
    let colnum=Math.floor(Math.random() * 10);

    //set shot to a random point, that has not already been shot
    do
    {
      rownum=Math.floor(Math.random() * 10); //random int 0 to 9
      colnum=Math.floor(Math.random() * 10);
    }while(this.hm[rownum][colnum] == 'X' && this.hm[rownum][colnum] == 'o');

    //look to see if a ship has been found
    for(let i = 0; i < 10 && exit == false; i++)
    {
      for(let j = 0; j < 10 && exit == false; j++)
      {
        if(hm[i][j] == 'X')
        {
          //check around the hit for an unshot spot
          if(hm[i+1][j] == '-')
          {
            exit = true;
            rownum = i + 1;
            colnum = j;
          }
          else if(hm[i-1][j] == '-')
          {
            exit = true;
            rownum = i - 1;
            colnum = j;
          }
          else if(hm[i][j+1] == '-')
          {
            exit = true;
            rownum = i;
            colnum = j + 1;
          }
          else if(hm[i][j-1] == '-')
          {
            exit = true;
            rownum = i;
            colnum = j - 1;
          }
        }
      }
    }

    if(human.incoming(colnum, rownum)) {
      this.hm[rownum][colnum] = 'X';
      hit = true;
      this.hits += 1;
    }
    else {
      this.hm[rownum][colnum] = 'o';
      hit = false;
    }

    return (hit);
  };

/**
 * hard mode firing
 * @memberOf AI
 * @function hardFire
 * @param {object} human - other player input
 * @return {boolean} - hit
 */
this.hardFire=function(human){
  let hit = false;
  let exit = false; //should I exit the search
  let rownum=0; //random int 0 to 9
  let colnum=0;

  for(let i = 0; i < 10 && exit == false; i++)
  {
    for(let j = 0; j < 10 && exit == false; j++)
    {
      if(human.ship[i][j]==='S')
      {
        rownum=i;
        colnum=j;
        exit = true;
      }
    }
  }

  if(human.incoming(colnum, rownum)) {

    this.hm[rownum][colnum] = 'X';
    hit = true;
    this.hits += 1;
  }
  else {
    this.hm[rownum][colnum] = 'o';
    hit = false;
  }

  return (hit);
};


 /**
  * take user input and react
  * @memberOf AI
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
	 * @memberOf AI
	 * @function gameover
	 */
	  this.gameover= function(){
	  	return (this.hits == this.hitstowin);
  	};

 	/**
	 * setup
	 * @memberOf AI
	 * @function setup
	 */
  this.setup= function(){};

};
