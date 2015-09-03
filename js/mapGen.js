/*global Phaser Pacmaze*/

Pacmaze.MapGen = function (game)
{
    this.game = game;
    
    this.mapWidth;
    this.mapHeight;
    this.map;
    this.windingPercent = 90;
    this.extraConnectorPercent = 20;
    
    // down, right, up, left
    this.cardinals = [new Phaser.Point(0, 1), new Phaser.Point(1, 0), 
                      new Phaser.Point(0, -1), new Phaser.Point(-1, 0)];
    
    this.cageRect;
    
    this.enemyBoxes = [];
};

Pacmaze.MapGen.prototype.createMaze = function (width, height, totalenemies)
{
    // the level generation does not work with even sized maps
    if(width % 2 === 0 || height % 2 === 0)
    {
        alert('The map must be odd sized.');
    }
    
    this.mapWidth = width;
    this.mapHeight = height;
    this.totalenemies = totalenemies;
    this.map = [];
    
    for(var column = 0; column < this.mapHeight; column++)
    {
        var rowArray = [];
        for(var row = 0; row < this.mapWidth; row++)
        {
            rowArray.push(1);
        }
        this.map.push(rowArray);
    }
    
    var xPos = this.game.rnd.between(0, Math.floor(this.mapWidth * 0.5) - 1) * 2 + 1;
    var yPos = this.game.rnd.between(0, Math.floor(this.mapHeight * 0.5) - 1) * 2 + 1;

    this.growMaze(new Phaser.Point(xPos, yPos));
    this.connectEdges();
    this.connectDeadEnds();
    this.addExtraConnectors();
    this.addEnemyBoxes(totalenemies);
    
    return this.converToCSV(this.map);
};

Pacmaze.MapGen.prototype.growMaze = function (start)
{
    var cells = [];
    var lastDirection;
    
     this.map[start.y][start.x] = 0;
     
     cells.push(start);
     
     while(cells.length > 0)
     {
        var cell = cells[cells.length - 1];
        var connectedWallCells = [];
         
        // get the connected sides that are walls
        this.cardinals.forEach(function(dir)
        {
            if(this.canGrow(cell, dir))
            {
                connectedWallCells.push(dir);
            }
        }, this);
         
        if(connectedWallCells.length > 0)
        {
            var dir;
            if(connectedWallCells.indexOf(lastDirection) != -1 && this.game.rnd.integerInRange(0, 100) < this.windingPercent)
            {
                dir = lastDirection;
            }
            else
            {
                dir = connectedWallCells[this.game.rnd.integerInRange(0, connectedWallCells.length - 1)];
            }
            
            // set two tiles to floor because we have to have a wall tile in between
            this.map[cell.y + dir.y][cell.x + dir.x] = 0;
            this.map[cell.y + dir.y * 2][cell.x + dir.x * 2] = 0;

            cells.push(new Phaser.Point(cell.x + dir.x * 2, cell.y + dir.y * 2));
            dir = lastDirection;
        }
        else
        {
            cells.pop();
            lastDirection = null;
        }
     }
};

Pacmaze.MapGen.prototype.canGrow = function (pos, direction)
{
    // this checks if there is a wall 3 blocks over to each side and if that is still inside the map
    if((pos.x + direction.x * 3 < 0 || pos.x + direction.x * 3 > this.mapWidth - 1) || (pos.y + direction.y * 3 < 0 || pos.y + direction.y * 3 > this.mapHeight - 1))
    {
        return false;
    }
    
    return this.map[pos.y + direction.y * 2][pos.x + direction.x * 2] !== 0;
};

// loop through the map array and make the outer loop all floors so you can walk around the level
Pacmaze.MapGen.prototype.connectEdges = function()
{
    for(var column = 1; column < this.mapHeight - 1; column++)
    {
        for(var row = 1; row < this.mapWidth - 1; row++)
        {
            if(row === 1 || row === this.mapWidth - 2 || column === 1 || column === this.mapHeight - 2)
            {
                if(this.map[column][row] === 1)
                {
                    this.map[column][row] = 0;
                }
            }
        }
    }
};

// loop through the map array and if there is a floor tile with 3 wall tiles surrounding it, 
// make one of the walls a floor to connect it to the rest of the level
Pacmaze.MapGen.prototype.connectDeadEnds = function ()
{
    var done = false;
    while(!done)
    {
        done = true;
        for(var y = 0; y < this.mapHeight; y++)
        {
            for(var x = 0; x < this.mapWidth; x++)
            {
                if(this.map[y][x] === 1) continue;
                var connectors = [];
                var exists = 0;
                
                // check how many surrounding walls are floors
                this.cardinals.forEach(function(dir)
                {
                    if(this.map[y + dir.y][x + dir.x] === 0)
                    {
                        exists++;
                    }
                    else
                    {
                        // if it is not a floor add the position to the possible connectors
                        connectors.push(new Phaser.Point(x + dir.x, y + dir.y));
                    }
                }, this);
                
                // if more than one connected tile is a floor this is not a dead end so no action is needed
                if(exists !== 1) continue;
                done = false;
                
                var foundPos = false;
                while(!foundPos)
                {
                    // get a random side to connect to
                    var nr = this.game.rnd.between(0, connectors.length - 1);
                    var pos = connectors[nr];
                    
                    // check if the connected tile is inside the map. if it is outside delete it
                    if(pos.x > 0 && pos.x < this.mapWidth - 1 && pos.y > 0 && pos.y < this.mapHeight - 1)
                    {
                        foundPos = true;
                        this.map[pos.y][pos.x] = 0;
                    }
                    else
                    {
                        connectors.splice(nr, 1);
                    }
                }
            }
        }
    }
};

Pacmaze.MapGen.prototype.addExtraConnectors = function ()
{
    var possibleConnectors = [];
    for(var column = 1; column < this.mapHeight - 1; column++)
    {
        for(var row = 1; row < this.mapWidth - 1; row++)
        {
            if(this.map[column][row] === 1)
            {
                var emptySides = [];
                this.cardinals.forEach(function(dir)
                {
                    if(this.map[column + dir.y][row + dir.x] === 0)
                    {
                        emptySides.push(dir);
                    }
                }, this);

                if(emptySides.length !== 2) continue;
                
                if((emptySides[0].x !== 0 && emptySides[1].x !== 0 && column % 6 === 0) || 
                  (emptySides[0].y !== 0 && emptySides[1].y !== 0 && row % 6 === 0))
                {
                    possibleConnectors.push(new Phaser.Point(row, column));
                }
            }
        }
    }
    
    for(var i = 0; i < possibleConnectors.length - 1; i++)
    {
        this.map[possibleConnectors[i].y][possibleConnectors[i].x] = 0;
    }
};

Pacmaze.MapGen.prototype.addEnemyBox = function ()
{
    var xStart = Math.floor(this.mapWidth * 0.5) - 3;
    var yStart = Math.floor(this.mapHeight * 0.5) - 3;
    for(var column = 0; column < 5; column++)
    {
        for(var row = 0; row < 7; row++)
        {
            if(column === 1 && row > 0 && row < 6 && row !== 3)
            {
                this.map[yStart + column][xStart + row] = 1;
            }
            else if(column === 2 && (row === 1 || row === 5))
            {
                this.map[yStart + column][xStart + row] = 1;
            }
            else if(column === 3 && row > 0 && row < 6)
            {
                this.map[yStart + column][xStart + row] = 1;
            }
            else if(column === 1 && row === 3)
            {
                this.map[yStart + column][xStart + row] = 2;
            }
            else if(column === 2 && row > 1 && row < 6)
            {
                this.map[yStart + column][xStart + row] = 2;
            }
            else
            {
                this.map[yStart + column][xStart + row] = 0;
            }
        }
    }
    
    this.cageRect = new Phaser.Rectangle(xStart, yStart, 7, 5);
};

Pacmaze.MapGen.prototype.addEnemyBoxes = function (nrOfBoxes)
{
    for(var i = 0; i < nrOfBoxes; i++)
    {
        var foundPos = false;
        
        while(!foundPos)
        {
            var rndX = this.game.rnd.between(1, this.mapWidth - 2);
            var rndY = this.game.rnd.between(1, this.mapHeight - 2);
            var pos = new Phaser.Point(rndX, rndY);
            
            if(this.map[pos.y][pos.x] === 1)
            {
                if(this.enemyBoxes.length > 0)
                {
                    for(var j = 0; j < this.enemyBoxes.length; j++)
                    {
                        var distance = Phaser.Point.distance(pos, this.enemyBoxes[j]);
                        if(distance > 7)
                        {
                            foundPos = true;
                            this.map[pos.y][pos.x] = 2;
                            this.enemyBoxes.push(pos);
                        }
                    }
                }
                else
                {
                    foundPos = true;
                    this.map[pos.y][pos.x] = 2;
                    this.enemyBoxes.push(pos);
                }
            }
        }
    }
};

// this converts the mapArray, which is an array of arrays to a CSV string we can use to load a tilemap
Pacmaze.MapGen.prototype.converToCSV = function (map)
{
    var csvString = '';
    for(var column = 0; column < map.length; column++)
    {
        for(var row = 0; row < map[0].length; row++)
        {
            csvString += map[column][row].toString();
            csvString += ",";
        }
        csvString = csvString.replace(/,\s*$/, "");
        csvString += '\n';
    }
    
    return csvString;
};