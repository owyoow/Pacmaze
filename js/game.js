/*global Phaser Pacmaze*/

Pacmaze.Game = function (game)
{
    
};

Pacmaze.Game.prototype.create = function ()
{
    console.log('seed: ' + Pacmaze.SEED);
    
    this.gameInput = new Pacmaze.Input(this);
    this.gameInput.setupInput();
    
    this.mapGen = new Pacmaze.MapGen(this);
    var mapString = this.mapGen.createMaze(25, 17);
    this.load.tilemap('map', null, mapString, Phaser.Tilemap.CSV);
    
    this.map = this.add.tilemap('map', Pacmaze.TILESIZE, Pacmaze.TILESIZE);
    this.map.addTilesetImage('tiles');
    
    this.mapLayer = this.map.createLayer(0);

    this.world.setBounds(0, -60, 800, 600);
    
    this.foodGroup = this.add.group();
    
    // loop through the map and put food on all the floor tiles
    for(var column = 0; column < this.mapGen.mapHeight; column++)
    {
        for(var row = 0; row < this.mapGen.mapWidth; row++)
        {
            // checking if the tile is a floor tile and if it is not inside the enemy cage
            if(this.mapGen.map[column][row] === 0 && (row < this.mapGen.cageRect.x + 1 || row > this.mapGen.cageRect.x + this.mapGen.cageRect.width - 2 ||
              column < this.mapGen.cageRect.y + 1 || column > this.mapGen.cageRect.y + this.mapGen.cageRect.height - 2))
            {
                var foodPos = Pacmaze.TILETOWORLDPOS(row, column);
                var food = this.add.sprite(foodPos.x, foodPos.y, 'food');
                food.anchor.setTo(0.5);
                this.foodGroup.add(food);
            }
        }
    }
    
    this.enemies = this.add.group();
    this.eFirstPos = Pacmaze.TILETOWORLDPOS(this.mapGen.cageRect.x + 3, this.mapGen.cageRect.y + 1);
    this.eBlue = new Pacmaze.EBlue(this, this.eFirstPos.x, this.eFirstPos.y, 1000);
    this.enemies.add(this.eBlue);
    
    this.eSecondPos = Pacmaze.TILETOWORLDPOS(this.mapGen.cageRect.x + 3, this.mapGen.cageRect.y + 2);
    this. blue2 = new Pacmaze.EBlue(this, this.eSecondPos.x, this.eSecondPos.y, 10000);
    this.enemies.add(this.blue2);
    
    this.eThirdPos = Pacmaze.TILETOWORLDPOS(this.mapGen.cageRect.x + 2, this.mapGen.cageRect.y + 2);
    this.blue3 = new Pacmaze.EBlue(this, this.eThirdPos.x, this.eThirdPos.y, 17000);
    this.enemies.add(this.blue3);
    
    this.eFourthPos = Pacmaze.TILETOWORLDPOS(this.mapGen.cageRect.x + 4, this.mapGen.cageRect.y + 2);
    this.blue4 = new Pacmaze.EBlue(this, this.eFourthPos.x, this.eFourthPos.y, 21000);
    this.enemies.add(this.blue4);
    
    this.playerPos = Pacmaze.TILETOWORLDPOS(this.mapGen.cageRect.x + 3, this.mapGen.cageRect.y + this.mapGen.cageRect.height - 1);
    this.player = new Pacmaze.Player(this, this.playerPos.x, this.playerPos.y);
};

Pacmaze.Game.prototype.update = function ()
{
    this.enemies.forEach(function(enemy)
    {
        if(this.checkOverlap(this.player, enemy))
        {
            this.reset();
        }
    }, this);
};

Pacmaze.Game.prototype.render = function ()
{
    this.game.debug.text(this.time.fps || '--', 2, 14, '#00ff00');
};

Pacmaze.Game.prototype.reset = function ()
{
    this.eBlue.reset(this.eFirstPos.x, this.eFirstPos.y);
    this.eBlue.delay = this.time.now + 1000;
    this.eBlue.inCage = true;
    this.eBlue.goal = Pacmaze.TILETOWORLDPOS(this.mapGen.cageRect.x + 3, this.mapGen.cageRect.y);
    this.eBlue.moveTarget.setTo(0, 0);
    
    this.blue2.reset(this.eSecondPos.x, this.eSecondPos.y);
    this.blue2.delay = this.time.now + 10000;
    this.blue2.inCage = true;
    this.blue2.goal = Pacmaze.TILETOWORLDPOS(this.mapGen.cageRect.x + 3, this.mapGen.cageRect.y);
    this.blue2.moveTarget.setTo(0, 0);
    
    this.blue3.reset(this.eThirdPos.x, this.eThirdPos.y);
    this.blue3.delay = this.time.now + 17000;
    this.blue3.inCage = true;
    this.blue3.goal = Pacmaze.TILETOWORLDPOS(this.mapGen.cageRect.x + 3, this.mapGen.cageRect.y);
    this.blue3.moveTarget.setTo(0, 0);
    
    this.blue4.reset(this.eFourthPos.x, this.eFourthPos.y);
    this.blue4.delay = this.time.now + 21000;
    this.blue4.inCage = true;
    this.blue4.goal = Pacmaze.TILETOWORLDPOS(this.mapGen.cageRect.x + 3, this.mapGen.cageRect.y);
    this.blue4.moveTarget.setTo(0, 0);
    
    this.player.reset(this.playerPos.x, this.playerPos.y);
    this.player.currentDirection = 0;
    this.player.moveTarget.setTo(0, 0);
};

Pacmaze.Game.prototype.checkOverlap = function (spriteA, spriteB)
{
    var boundsA = spriteA.getBounds();
    var boundsB = spriteB.getBounds();

    return Phaser.Rectangle.intersects(boundsA, boundsB);  
};