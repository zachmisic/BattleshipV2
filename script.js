let grid = document.querySelector("body").appendChild(document.createElement("table"));
let gridElement = "";
let row = "";
let elem = "";
let temp = "";
let start = true; // determines if the game has started or not

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
	for(let i=0;i<10;i++)
	{
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
});

init();
// change top declaration of grid from appending to body, to returning from a function and handing a fully formed table into the dom
// let grid = makeGrid()