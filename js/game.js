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
    
    var pos = Pacmaze.TILETOWORLDPOS(this.mapGen.cageRect.x + 3, this.mapGen.cageRect.y + this.mapGen.cageRect.height - 1);
    var player = new Pacmaze.Player(this, pos.x, pos.y);
};

Pacmaze.Game.prototype.update = function ()
{
    
};

Pacmaze.Game.prototype.render = function ()
{
    this.game.debug.text(this.time.fps || '--', 2, 14, '#00ff00');
};