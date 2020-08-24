import  { horVerOffsets, diagOffsets } from './tables';

class Location {

    constructor(x, y, pathTaken) {
        this.posX = x
        this.posY = y
        this.pathTaken = pathTaken
    }

}

class Square3 {
    constructor(startX, startY, stopX, stopY, board, diagonalSearch = false) {

        this.grid = board

        this.maxX = board[0].length - 1
        this.maxY = board.length - 1
        this.startX = startX
        this.startY = startY
        this.stopX = stopX
        this.stopY = stopY
        this.queue = []
        this.queue.push(new Location(startX, startY, []))
            //console.log(this.queue)
            //mark start as visited
        this.grid[startY][startX] = 99
        this.finalLocation = 0 //0000000000000000000000000000000000
        this.blockedVlaue = 99
        this.diagonalSearch = diagonalSearch
    }

    blockedCells(locList) {
        locList.map(x => {
            this.grid[x[1]][x[0]] = this.blockedValue
            return 0
        })
    }


    locOnBoard(y, x) {
        return (x <= this.maxX && x >= 0 && y <= this.maxY && y >= 0) ?
            true : false
    }

    adjacentCellEmpty(x, y) {
        let isEmptyCell = false
            //console.log(` x is ${x} y is ${y}`)
        if (this.locOnBoard(y, x) && this.grid[y][x] === -1) {
            this.grid[y][x] = this.blockedValue
            isEmptyCell = true
        }
        return isEmptyCell

    }

    atFinishLocation(location) {
        return (location.posX === this.stopX && location.posY === this.stopY) ?
            true : false
    }

    findPath() {
        //Always one item at start
        var found = false
        while (this.queue.length > 0 && found === false) {
            //x = this.queue.shift()  
            found = this.mark2(this.queue.shift())
        }
        if (found) {
           return([true,this.finalLocation.pathTaken, this.queue])
        } else {
           return([false,[], this.queue])
        }
    }

    stepFindPath() {
        var found = this.mark2(this.queue.shift())
        return [found,this.queue]
    }

    mark2(currentLocation) {
		//So for this cell. Check the cells around it.
		//Check order North, East, South and West
		//Doubt this matters. At each location check if
		//its the stop location, at this point force exit.
		//Each free location found is pushed on to the 
		//end of the queue

        var directionOffsets = 
                    (this.diagonalSearch === false) ? horVerOffsets :
                     [...horVerOffsets, ...diagOffsets]       
        let found = false
        let x = currentLocation.posX
        let y = currentLocation.posY
        for (let i = 0; i < directionOffsets.length; i++) {
            var newX = x + directionOffsets[i].xOffset
            var newY = y + directionOffsets[i].yOffset
            //console.log(x, y, newX, newY)
            if (this.adjacentCellEmpty(newX, newY)) {
				//slice for shallow copy
                var path = currentLocation.pathTaken.slice()
                path.push(directionOffsets[i].direction)
                var tempLoc = new Location(newX, newY, path)
                //this.queue.push(tempLoc)
                //We have reached final location need to stop
                //searching 
                if (this.atFinishLocation(tempLoc)) {
                    this.finalLocation = tempLoc                  
                    found = true
                    break //breaks for loop
                } 
                else {  
                  this.queue.push(tempLoc)
                }
            }
        }
        return found
    }


}

//const range = min => max => [...Array(max).keys()].map((_, i) => i + min)
//const map77 = f => xs => xs.map(f)
//const k = x => _ => x
//const rep = c => n => map77(k(c))(range(0)(n))

//const makeBoard   = val => rows => cols => rep(0)(rows).map(x => rep(val)(cols))
const makeBoard   = val => rows => cols =>  Array(rows).fill().map(() => Array(cols).fill(val))
//const clear = "CLEAR"
     
const pathFind = function(startX,startY,stopX,stopY, rows, cols, blocked, diagonalSearch) {
	//alert("stAER")
	 let s = new Square3(startX,startY,stopX,stopY, makeBoard(-1)(rows)(cols), diagonalSearch)
	 //let s = yy.test()
	 //console.log("here i ahere")
	 s.blockedCells(blocked)
     return s.findPath()
};


export { pathFind }


